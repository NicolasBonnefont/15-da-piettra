"use server"

import getSession from "@/lib/get-session"
import { deleteFromMinio, extractKeyFromUrl, uploadToMinio } from "@/lib/minio"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function uploadPhoto(file: File, caption?: string) {
  const session = await getSession()

  if (!session || !session.user) {
    throw new Error("Você precisa estar logado para enviar uma foto")
  }

  // Gerar um nome de arquivo único
  const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`

  // Fazer upload do arquivo para o MinIO e obter a URL
  const url = await uploadToMinio(file, key)

  // Salvar a referência no banco de dados
  const photo = await prisma.photo.create({
    data: {
      url,
      caption,
      userId: session.user.id as string,
    },
  })

  revalidatePath("/fotos")
  return photo
}

export async function getPhotos() {
  const photos = await prisma.photo.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  return photos
}

export async function addComment(photoId: string, content: string) {
  const session = await getSession()

  if (!session || !session.user) {
    throw new Error("Você precisa estar logado para comentar")
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      photoId,
      userId: session.user.id as string,
    },
  })

  revalidatePath("/fotos")
  return comment
}

export async function deletePhoto(photoId: string) {
  const session = await getSession()

  if (!session || !session.user) {
    throw new Error("Você precisa estar logado para excluir uma foto")
  }

  // Verificar se o usuário é o proprietário da foto
  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
    select: { userId: true, url: true },
  })

  if (!photo) {
    throw new Error("Foto não encontrada")
  }

  if (photo.userId !== session.user.id) {
    throw new Error("Você não tem permissão para excluir esta foto")
  }

  // Excluir o arquivo do MinIO
  if (photo.url) {
    try {
      const key = await extractKeyFromUrl(photo.url)
      await deleteFromMinio(key)
    } catch (error) {
      console.error("Erro ao excluir arquivo do MinIO:", error)
      // Continuar com a exclusão do banco de dados mesmo se a exclusão do MinIO falhar
    }
  }

  // Excluir todos os comentários relacionados à foto
  await prisma.comment.deleteMany({
    where: { photoId },
  })

  // Excluir a foto do banco de dados
  await prisma.photo.delete({
    where: { id: photoId },
  })

  revalidatePath("/fotos")
  return { success: true }
}

export async function deleteComment(commentId: string) {
  const session = await getSession()

  if (!session || !session.user) {
    throw new Error("Você precisa estar logado para excluir um comentário")
  }

  // Verificar se o usuário é o proprietário do comentário
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  })

  if (!comment) {
    throw new Error("Comentário não encontrado")
  }

  if (comment.userId !== session.user.id) {
    throw new Error("Você não tem permissão para excluir este comentário")
  }

  // Excluir o comentário
  await prisma.comment.delete({
    where: { id: commentId },
  })

  revalidatePath("/fotos")
  return { success: true }
}
