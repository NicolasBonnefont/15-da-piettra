"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Camera } from "lucide-react"
import { useState } from "react"
import { PhotoUploadForm } from "./photo-upload-form"

export function UploadPhotoButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full px-6 py-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
          <Camera className="h-5 w-5" />
          <span className="font-medium">Compartilhar Foto</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-pink-800">Compartilhar uma foto</DialogTitle>
          <DialogDescription className="text-center">
            Compartilhe seus momentos especiais da festa de 15 anos
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <PhotoUploadFormWithClose setIsOpen={setIsOpen} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Wrapper para o formulário que pode fechar o modal após o upload bem-sucedido
function PhotoUploadFormWithClose({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  const handleSuccess = () => {
    // Fechar o modal após o upload bem-sucedido
    setIsOpen(false)
  }

  return <PhotoUploadForm onSuccess={handleSuccess} />
}
