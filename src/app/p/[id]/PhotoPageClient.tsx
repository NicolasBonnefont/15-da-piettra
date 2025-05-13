"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Download, Home } from "lucide-react"
import { Playfair_Display } from "next/font/google"
import Image from "next/image"
import Link from "next/link"

const playfair = Playfair_Display({ subsets: ["latin"] })

interface Photo {
  id: string
  url: string
  caption: string | null
  createdAt: Date
  user: {
    name: string | null
    image: string | null
  }
  _count: {
    likes: number
  }
}

interface PhotoPageClientProps {
  photo: Photo
}

export default function PhotoPageClient({ photo }: PhotoPageClientProps) {
  // Função para download da imagem
  const handleDownload = async () => {
    // Esta função será implementada no cliente
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className={cn(playfair.className, "text-3xl md:text-4xl font-bold text-pink-800 mb-2")}>
            Festa de 15 Anos da Piettra
          </h1>
          <p className="text-pink-600 mb-6">Compartilhando momentos especiais</p>
          <Button asChild variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar para a galeria
            </Link>
          </Button>
        </header>

        <Card className="overflow-hidden border-gray-200 rounded-lg shadow-md max-w-2xl mx-auto">
          {/* Cabeçalho - Usuário */}
          <div className="flex items-center p-4 border-b border-gray-100">
            <Avatar className="h-10 w-10 border border-gray-200 mr-3">
              <AvatarImage src={photo.user.image || ""} alt={photo.user.name || "Convidado"} />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white">
                {photo.user.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{photo.user.name || "Convidado"}</div>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(photo.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="relative aspect-square w-full bg-gray-50">
            <Image
              src={photo.url || "/placeholder.svg"}
              alt={photo.caption || "Foto da festa"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>

          {/* Legenda e informações */}
          <div className="p-4">
            {photo.caption && (
              <p className="text-gray-800 mb-4">
                <span className="font-medium mr-2">{photo.user.name || "Convidado"}</span>
                {photo.caption}
              </p>
            )}

            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-700">
                {photo._count.likes > 0
                  ? `${photo._count.likes} curtida${photo._count.likes !== 1 ? "s" : ""}`
                  : "0 curtidas"}
              </div>

              <form action={handleDownload}>
                <Button
                  type="submit"
                  variant="outline"
                  className="border-pink-200 text-pink-700 hover:bg-pink-50"
                  onClick={() => {
                    // Criar um link temporário para download
                    const a = document.createElement("a")
                    a.href = photo.url

                    // Extrair a extensão do arquivo da URL
                    const extension = photo.url.split(".").pop()?.split("?")[0] || "jpg"

                    // Criar um nome de arquivo baseado na data ou na legenda
                    const fileName = photo.caption
                      ? `piettra15anos_${photo.caption.substring(0, 20).replace(/[^a-z0-9]/gi, "_")}.${extension}`
                      : `piettra15anos_foto_${new Date().toISOString().split("T")[0]}.${extension}`

                    a.download = fileName
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar foto
                </Button>
              </form>
            </div>
          </div>
        </Card>

        <footer className="mt-10 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} - Festa de 15 Anos da Piettra</p>
        </footer>
      </div>
    </main>
  )
}
