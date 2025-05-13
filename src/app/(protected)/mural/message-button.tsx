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
import { MessageCircle } from "lucide-react"
import { useState } from "react"
import { MessageForm } from "./message-form"

export function MessageButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full px-6 py-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">Deixar uma Mensagem</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-pink-800">Deixar uma Mensagem</DialogTitle>
          <DialogDescription className="text-center">
            Compartilhe seus desejos e palavras especiais para a Piettra
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <MessageFormWithClose setIsOpen={setIsOpen} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Wrapper para o formulário que pode fechar o modal após o envio bem-sucedido
function MessageFormWithClose({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  const handleSuccess = () => {
    // Fechar o modal após o envio bem-sucedido
    setIsOpen(false)
  }

  return <MessageForm onSuccess={handleSuccess} />
}
