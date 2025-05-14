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
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, Send, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { addComment, deleteComment } from "./actions"

type Comment = {
  id: string
  content: string
  createdAt: Date
  userId: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

type Photo = {
  id: string
  comments: Comment[]
  // outros campos da foto...
}

interface CommentSectionProps {
  photo: Photo
  currentUserId?: string
  onCommentAdded?: (newComment: Comment) => void
  onCommentDeleted?: (commentId: string) => void
}

export function CommentSection({ photo, currentUserId, onCommentAdded, onCommentDeleted }: CommentSectionProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localComments, setLocalComments] = useState<Comment[]>(photo.comments)
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      toast.error("O comentário não pode estar vazio")
      return
    }

    if (!currentUserId) {
      toast.error("Você precisa estar logado para comentar")
      return
    }

    setIsSubmitting(true)

    try {
      const newComment = await addComment(photo.id, comment)

      // Criar um objeto de comentário completo para atualização local
      const completeComment: Comment = {
        ...newComment,
        user: {
          id: currentUserId,
          name: "Você", // Placeholder temporário
          image: null, // Placeholder temporário
        },
      }

      // Atualizar o estado local com o novo comentário
      setLocalComments((prev) => [...prev, completeComment])

      // Notificar o componente pai sobre o novo comentário
      if (onCommentAdded) {
        onCommentAdded(completeComment)
      }

      // Limpar o campo de comentário
      setComment("")

      toast.success("Comentário adicionado com sucesso")
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error)
      toast.error("Não foi possível adicionar o comentário. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUserId) {
      toast.error("Você precisa estar logado para excluir um comentário")
      return
    }

    setDeletingCommentId(commentId)

    try {
      const result = await deleteComment(commentId)

      if (result.success) {
        // Atualizar o estado local removendo o comentário
        setLocalComments((prev) => prev.filter((c) => c.id !== commentId))

        // Notificar o componente pai sobre a exclusão
        if (onCommentDeleted) {
          onCommentDeleted(commentId)
        }

        toast.success("Comentário excluído com sucesso")
      } else {
        throw new Error("Falha ao excluir o comentário")
      }
    } catch (error) {
      console.error("Erro ao excluir comentário:", error)
      toast.error("Não foi possível excluir o comentário. Tente novamente.")
    } finally {
      setDeletingCommentId(null)
    }
  }

  return (
    <div className="space-y-3">
      {/* Lista de comentários */}
      {localComments.length > 0 ? (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {localComments.map((comment) => (
            <div key={comment.id} className="flex gap-2 group">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src={comment.user.image || ""} alt={comment.user.name || "Usuário"} />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white text-xs">
                  {comment.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="font-medium text-xs">{comment.user.name || "Usuário"}</span>
                  <p className="text-xs break-words">{comment.content}</p>
                </div>
                <p className="text-[10px] text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>

              {/* Opções do comentário (excluir) - apenas para o autor - SEMPRE VISÍVEL */}
              {currentUserId === comment.userId && (
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full text-pink-500 hover:bg-pink-50 hover:text-pink-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir comentário</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteComment(comment.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {deletingCommentId === comment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 italic">Seja o primeiro a comentar</p>
      )}

      {/* Formulário de comentário */}
      {currentUserId && (
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Textarea
            placeholder="Adicione um comentário..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[60px] text-sm resize-none border-pink-200 focus-visible:ring-pink-400"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full p-2 h-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      )}
    </div>
  )
}
