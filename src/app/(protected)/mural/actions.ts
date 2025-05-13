"use server"

import getSession from "@/lib/get-session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createMessage(content: string, stickerId?: string) {
  const session = await getSession()

  if (!session || !session.user) {
    throw new Error("Você precisa estar logado para enviar uma mensagem")
  }

  const message = await prisma.message.create({
    data: {
      content,
      stickerId,
      userId: session.user.id as string,
    },
  })

  revalidatePath("/mural")
  return message
}

export async function getMessages() {
  const messages = await prisma.message.findMany({
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
    },
  })

  return messages
}

export async function deleteMessage(messageId: string) {
  const session = await getSession()

  if (!session || !session.user) {
    throw new Error("Você precisa estar logado para excluir uma mensagem")
  }

  // Verificar se o usuário é o autor da mensagem
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: { userId: true },
  })

  if (!message) {
    throw new Error("Mensagem não encontrada")
  }

  if (message.userId !== session.user.id) {
    throw new Error("Você não tem permissão para excluir esta mensagem")
  }

  // Excluir a mensagem
  await prisma.message.delete({
    where: { id: messageId },
  })

  revalidatePath("/mural")
  return { success: true }
}
