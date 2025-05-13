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

  try {
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
  } catch (error) {
    console.error("Erro ao fazer upload da foto:", error)
    throw new Error(error instanceof Error ? error.message : "Falha ao fazer upload da imagem")
  }
}

export async function getPhotos() {
  const session = await getSession()
  const userId = session?.user?.id

  const photos = await prisma.photo.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      likes: {
        select: {
          id: true,
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  })

  // Adicionar informação se o usuário atual curtiu cada foto
  const photosWithLikeInfo = photos.map((photo) => ({
    ...photo,
    likedByMe: userId ? photo.likes.some((like) => like.userId === userId) : false,
    likesCount: photo._count.likes,
  }))

  return photosWithLikeInfo
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

  // Excluir todos os comentários, likes e notificações relacionados à foto
  await prisma.$transaction([
    prisma.comment.deleteMany({
      where: { photoId },
    }),
    prisma.like.deleteMany({
      where: { photoId },
    }),
    prisma.notification.deleteMany({
      where: { photoId },
    }),
    prisma.photo.delete({
      where: { id: photoId },
    }),
  ])

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

export async function toggleLike(photoId: string) {
  const session = await getSession()

  if (!session || !session.user) {
    throw new Error("Você precisa estar logado para curtir uma foto")
  }

  const userId = session.user.id as string

  // Verificar se o usuário já curtiu a foto
  const existingLike = await prisma.like.findUnique({
    where: {
      photoId_userId: {
        photoId,
        userId,
      },
    },
  })

  // Obter informações da foto para a notificação
  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
    select: { userId: true },
  })

  if (!photo) {
    throw new Error("Foto não encontrada")
  }

  if (existingLike) {
    // Se já curtiu, remover o like
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    })

    // Remover a notificação relacionada a este like
    await prisma.notification.deleteMany({
      where: {
        type: "like",
        photoId,
        actorId: userId,
      },
    })

    revalidatePath("/fotos")
    return { liked: false }
  } else {
    // Se não curtiu, adicionar o like
    await prisma.like.create({
      data: {
        photoId,
        userId,
      },
    })

    // Criar notificação apenas se o usuário que curtiu não for o dono da foto
    if (photo.userId !== userId) {
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      })

      await prisma.notification.create({
        data: {
          type: "like",
          message: `${currentUser?.name || "Alguém"} curtiu sua foto`,
          userId: photo.userId, // Usuário que recebe a notificação (dono da foto)
          actorId: userId, // Usuário que realizou a ação (quem curtiu)
          photoId,
        },
      })
    }

    revalidatePath("/fotos")
    return { liked: true }
  }
}

export async function getNotifications() {
  const session = await getSession()

  if (!session || !session.user) {
    return []
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id as string,
    },
    include: {
      actor: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20, // Limitar a 20 notificações mais recentes
  })

  return notifications
}

export async function markNotificationsAsRead() {
  const session = await getSession()

  if (!session || !session.user) {
    return { success: false }
  }

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id as string,
      read: false,
    },
    data: {
      read: true,
    },
  })

  revalidatePath("/fotos")
  return { success: true }
}

export async function getUnreadNotificationsCount() {
  const session = await getSession()

  if (!session || !session.user) {
    return 0
  }

  const count = await prisma.notification.count({
    where: {
      userId: session.user.id as string,
      read: false,
    },
  })

  return count
}
