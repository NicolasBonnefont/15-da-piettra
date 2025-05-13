"use client"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import type React from "react"
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
  const [showAllComments, setShowAllComments] = useState(false)

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

  // Limitar comentários visíveis a 2, a menos que showAllComments seja true
  const visibleComments = showAllComments ? photo.comments : photo.comments.slice(0, 2)

  const hasMoreComments = photo.comments.length > 2 && !showAllComments

  return (
    <div>
      {/* Lista de comentários */}
      {photo.comments.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {visibleComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <p className="text-sm">
                <span className="font-medium mr-1.5">{comment.user.name || "Convidado"}</span>
                {comment.content}

                {/* Botão de exclusão para o autor do comentário */}
                {currentUserId === comment.userId && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="ml-2 text-gray-400 hover:text-gray-600">
                        <Trash2 className="h-3 w-3 inline" />
                      </button>
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
              </p>
            </div>
          ))}

          {/* Botão "Ver todos os comentários" */}
          {hasMoreComments && (
            <button onClick={() => setShowAllComments(true)} className="text-sm text-gray-500 hover:text-gray-700">
              Ver todos os {photo.comments.length} comentários
            </button>
          )}
        </div>
      )}

      {/* Formulário de comentário */}
      <form onSubmit={handleSubmitComment} className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <Input
          placeholder="Adicione um comentário..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border-none text-sm focus-visible:ring-0 px-0 py-1 h-auto"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="text-pink-600 hover:text-pink-700 hover:bg-transparent px-2"
          disabled={isSubmitting || !comment.trim()}
        >
          {isSubmitting ? "Enviando..." : "Publicar"}
        </Button>
      </form>
    </div>
  )
}
