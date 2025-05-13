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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, MoreHorizontal, Share2, Trash2 } from "lucide-react"
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => document.getElementById(`share-${photoId}`)?.click()}
        >
          <Share2 className="mr-2 h-4 w-4" />
          <span>Compartilhar</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => document.getElementById(`download-${photoId}`)?.click()}
        >
          <Download className="mr-2 h-4 w-4" />
          <span>Baixar</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer text-red-600" onSelect={(e) => e.preventDefault()}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
