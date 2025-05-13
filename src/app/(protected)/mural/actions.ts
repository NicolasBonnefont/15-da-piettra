"use server"

import getSession from "@/lib/get-session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createMessage(content: string) {
  const session = await getSession()
  const message = await prisma.message.create({
    data: {
      content,
      userId: session!.user.id as string,
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
          name: true,
          image: true,
        },
      },
    },
  })

  return messages
}
