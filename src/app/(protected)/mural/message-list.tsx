import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getMessages } from "./actions"

export async function MessageList() {
  const messages = await getMessages()

  if (messages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Ainda não há mensagens. Seja o primeiro a deixar uma mensagem para a Piettra!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <Card key={message.id} className="border-pink-100">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <Avatar>
              <AvatarImage src={message.user.image || ""} alt={message.user.name || "Convidado"} />
              <AvatarFallback className="bg-pink-200 text-pink-700">
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
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
