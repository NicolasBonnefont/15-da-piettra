"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import { createMessage } from "./actions"

export function MessageForm() {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!content.trim()) {
      toast.info("Por favor, escreva uma mensagem.")
      return
    }

    setIsSubmitting(true)

    try {
      await createMessage(content)
      setContent("")
      toast.success("Sua mensagem foi adicionada ao mural.")
    } catch {
      toast.error("Não foi possível enviar sua mensagem. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Escreva uma mensagem especial para a Piettra..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] border-pink-200 focus:border-pink-400"
      />
      <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
      </Button>
    </form>
  )
}
