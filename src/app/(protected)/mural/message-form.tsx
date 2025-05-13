"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { createMessage } from "./actions"

// Stickers predefinidos
const STICKERS = [
  { id: "heart.jpg", name: "Coração" },
  { id: "cake.jpg", name: "Bolo" },
  { id: "ballon.png", name: "Balão" }
]

interface MessageFormProps {
  onSuccess?: () => void
}

export function MessageForm({ onSuccess }: MessageFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!content.trim() && !selectedSticker) {
      toast.info("Por favor, escreva uma mensagem ou adicione um sticker.")
      return
    }

    setIsSubmitting(true)

    try {
      await createMessage(content, selectedSticker || undefined)

      // Limpar o formulário
      setContent("")
      setSelectedSticker(null)

      toast.success("Sua mensagem foi adicionada ao mural.")

      // Chamar callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      toast.error("Não foi possível enviar sua mensagem. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Textarea
        placeholder="Escreva uma mensagem especial para a Piettra..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] border-pink-200 focus-visible:ring-pink-400 rounded-xl text-base"
      />

      {/* Seleção de stickers */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Adicionar um sticker (opcional)</h3>
        <div className="grid grid-cols-4 gap-4">
          {STICKERS.map((sticker) => (
            <button
              key={sticker.id}
              type="button"
              onClick={() => setSelectedSticker(sticker.id === selectedSticker ? null : sticker.id)}
              className={cn(
                "p-2 rounded-lg border transition-all",
                sticker.id === selectedSticker
                  ? "border-pink-500 bg-pink-50 shadow-md"
                  : "border-gray-200 hover:border-pink-300",
              )}
              title={sticker.name}
            >
              <div className="relative aspect-square w-full">
                <Image src={`/stickers/${sticker.id}`} alt={sticker.name} fill className="object-contain" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
            </>
          ) : (
            "Enviar Mensagem"
          )}
        </Button>
      </div>
    </form>
  )
}
