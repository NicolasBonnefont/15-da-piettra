"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, Facebook, Link, Share2, Smartphone, Twitter, PhoneIcon as WhatsApp } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type Photo = {
  id: string
  url: string
  caption?: string | null
  user: {
    name: string | null
  }
}

export function SharePhotoMenu({ photo }: { photo: Photo }) {
  const [isLoading, setIsLoading] = useState(false)

  // Função para compartilhar usando a Web Share API (quando disponível)
  const shareWithWebShare = async () => {
    if (!navigator.share) {
      toast.error("Seu navegador não suporta compartilhamento direto")
      return false
    }

    try {
      await navigator.share({
        title: "Festa de 15 Anos da Piettra",
        text: `Confira esta foto ${photo.caption ? `"${photo.caption}"` : ""} compartilhada por ${photo.user.name || "um convidado"
          }!`,
        url: photo.url, // Link direto da foto
      })
      return true
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Erro ao compartilhar:", error)
        return false
      }
      return true // Usuário cancelou, não é um erro
    }
  }

  // Função para gerar URLs de compartilhamento para diferentes plataformas
  const generateShareUrl = (platform: string) => {
    const url = encodeURIComponent(photo.url) // Link direto da foto
    const text = encodeURIComponent(
      `Confira esta foto ${photo.caption ? `"${photo.caption}"` : ""} da Festa de 15 Anos da Piettra!`,
    )

    switch (platform) {
      case "whatsapp":
        return `https://api.whatsapp.com/send?text=${text}%20${url}`
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${text}&url=${url}`
      case "telegram":
        return `https://t.me/share/url?url=${url}&text=${text}`
      default:
        return ""
    }
  }

  // Função para copiar o link para a área de transferência
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(photo.url) // Link direto da foto
      toast.success("Link da foto copiado para a área de transferência")
      return true
    } catch (error) {
      console.error("Erro ao copiar link:", error)
      toast.error("Não foi possível copiar o link")
      return false
    }
  }

  // Função para baixar a imagem
  const downloadImage = async () => {
    setIsLoading(true)
    try {
      // Criar um link temporário para download
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url

      // Extrair a extensão do arquivo da URL
      const extension = photo.url.split(".").pop()?.split("?")[0] || "jpg"

      // Criar um nome de arquivo baseado na data ou na legenda
      const fileName = photo.caption
        ? `piettra15anos_${photo.caption.substring(0, 20).replace(/[^a-z0-9]/gi, "_")}.${extension}`
        : `piettra15anos_foto_${new Date().toISOString().split("T")[0]}.${extension}`

      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Download iniciado")
      return true
    } catch (error) {
      console.error("Erro ao baixar imagem:", error)
      toast.error("Não foi possível baixar a imagem")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-gray-800 hover:text-gray-600 transition-colors">
          <Share2 className="h-6 w-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={async () => {
            const success = await shareWithWebShare()
            if (!success) {
              // Se a Web Share API falhar, abrir o menu de compartilhamento do WhatsApp
              window.open(generateShareUrl("whatsapp"), "_blank")
            }
          }}
          className="cursor-pointer"
        >
          <Smartphone className="mr-2 h-4 w-4" />
          <span>Compartilhar</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => window.open(generateShareUrl("whatsapp"), "_blank")}
          className="cursor-pointer"
        >
          <WhatsApp className="mr-2 h-4 w-4" />
          <span>WhatsApp</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => window.open(generateShareUrl("facebook"), "_blank")}
          className="cursor-pointer"
        >
          <Facebook className="mr-2 h-4 w-4" />
          <span>Facebook</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => window.open(generateShareUrl("twitter"), "_blank")} className="cursor-pointer">
          <Twitter className="mr-2 h-4 w-4" />
          <span>Twitter</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={copyLink} className="cursor-pointer">
          <Link className="mr-2 h-4 w-4" />
          <span>Copiar link da foto</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={downloadImage} className="cursor-pointer" disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Baixando..." : "Baixar foto"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
