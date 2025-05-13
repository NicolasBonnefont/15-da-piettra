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
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { deleteMessage } from "./actions"

export function DeleteMessageButton({ messageId }: { messageId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deleteMessage(messageId)
      toast.success("Mensagem excluída com sucesso")
    } catch (error) {
      toast.error("Erro ao excluir a mensagem. Tente novamente.")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-gray-400 hover:text-pink-600 p-1 rounded-full hover:bg-pink-50 transition-colors">
          <Trash2 className="h-5 w-5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-pink-100 rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir mensagem</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800 rounded-full">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full text-white"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
