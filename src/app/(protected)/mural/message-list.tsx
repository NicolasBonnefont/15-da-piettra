import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import getSession from "@/lib/get-session"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MessageSquare } from "lucide-react"
import Image from "next/image"
import { getMessages } from "./actions"
import { DeleteMessageButton } from "./delete-message-button"

export async function MessageList() {
  const messages = await getMessages()
  const session = await getSession()
  const currentUserId = session?.user?.id

  if (messages.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="flex justify-center mb-4">
          <MessageSquare className="h-12 w-12 text-pink-200" />
        </div>
        <p className="text-gray-500 text-lg">
          Ainda não há mensagens. Seja o primeiro a deixar uma mensagem para a Piettra!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {messages.map((message) => (
        <Card
          key={message.id}
          className="border-pink-100 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-pink-50 to-white">
            <div className="flex items-center gap-3">
              <Avatar className="border border-pink-100">
                <AvatarImage src={message.user.image || ""} alt={message.user.name || "Convidado"} />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white">
                  {message.user.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{message.user.name || "Convidado"}</div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </div>
              </div>
            </div>

            {/* Botão de exclusão - aparece apenas para o autor da mensagem */}
            {currentUserId === message.user.id && <DeleteMessageButton messageId={message.id} />}
          </CardHeader>

          <CardContent className="pt-4">
            {/* Conteúdo da mensagem */}
            {message.content && <p className="whitespace-pre-wrap mb-4 text-gray-700">{message.content}</p>}

            {/* Sticker (se houver) */}
            {message.stickerId && (
              <div className="flex justify-center my-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={`/stickers/${message.stickerId}`}
                    alt={`Sticker ${message.stickerId}`}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
