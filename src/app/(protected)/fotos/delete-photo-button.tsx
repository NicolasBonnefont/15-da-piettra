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
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { deletePhoto } from "./actions"

export function DeletePhotoButton({ photoId }: { photoId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deletePhoto(photoId)
      toast.success("Foto excluída com sucesso")
    } catch (error) {
      toast.error("Erro ao excluir a foto. Tente novamente.")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-pink-700 hover:text-pink-800 hover:bg-pink-50">
          <Trash2 className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-pink-100">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir foto</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita e todos os comentários serão
            excluídos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-pink-200 text-pink-700">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
