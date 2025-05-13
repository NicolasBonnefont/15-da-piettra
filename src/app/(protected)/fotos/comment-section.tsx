"use client"

import type React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { addComment, deleteComment } from "./actions"

type Comment = {
  id: string
  content: string
  createdAt: Date
  userId: string
  user: {
    name: string | null
    image: string | null
  }
}

type Photo = {
  id: string
  userId: string
  comments: Comment[]
}

export function CommentSection({ photo, currentUserId }: { photo: Photo; currentUserId?: string }) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentBeingDeleted, setCommentBeingDeleted] = useState<string | null>(null)

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()

    if (!comment.trim()) return

    setIsSubmitting(true)

    try {
      await addComment(photo.id, comment)
      setComment("")
    } catch {
      toast.error("Não foi possível adicionar seu comentário. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteComment(commentId: string) {
    setCommentBeingDeleted(commentId)
    try {
      await deleteComment(commentId)
      toast.success("Comentário excluído com sucesso")
    } catch (error) {
      toast.error("Erro ao excluir o comentário. Tente novamente.")
      console.error(error)
    } finally {
      setCommentBeingDeleted(null)
    }
  }

  return (
    <div className="mt-2">
      <h3 className="font-medium text-sm text-gray-700 mb-2">
        {photo.comments.length > 0
          ? `${photo.comments.length} comentário${photo.comments.length > 1 ? "s" : ""}`
          : "Comentários"}
      </h3>

      {photo.comments.length > 0 && (
        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
          {photo.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={comment.user.image || ""} alt={comment.user.name || "Convidado"} />
                <AvatarFallback className="text-xs bg-pink-200 text-pink-700">
                  {comment.user.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg px-3 py-2 flex justify-between items-start">
                  <div>
                    <span className="font-medium text-sm">{comment.user.name || "Convidado"}</span>
                    <p className="text-sm">{comment.content}</p>
                  </div>

                  {/* Mostrar botão de exclusão apenas para o autor do comentário */}
                  {currentUserId === comment.userId && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-pink-700 hover:bg-transparent -mt-1 -mr-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-pink-100">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir comentário</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-pink-200 text-pink-700">Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={commentBeingDeleted === comment.id}
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                          >
                            {commentBeingDeleted === comment.id ? "Excluindo..." : "Excluir"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <Input
          placeholder="Adicione um comentário..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border-pink-200"
        />
        <Button
          type="submit"
          size="sm"
          className="bg-pink-600 hover:bg-pink-700"
          disabled={isSubmitting || !comment.trim()}
        >
          Enviar
        </Button>
      </form>
    </div>
  )
}
