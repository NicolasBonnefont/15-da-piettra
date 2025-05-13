import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Calendar, Download } from "lucide-react"
import type { Metadata, ResolvingMetadata } from "next"
import { Playfair_Display } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

const playfair = Playfair_Display({ subsets: ["latin"] })

type Props = {
  params: Promise<{ id: string }>
}

// Gerar metadados dinâmicos para SEO e compartilhamento
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhoto(id)

  if (!photo) {
    return {
      title: "Foto não encontrada - Festa de 15 Anos da Piettra",
      description: "Esta foto não foi encontrada ou não está mais disponível.",
    }
  }

  const title = photo.caption ? `${photo.caption} - Festa de 15 Anos da Piettra` : "Foto da Festa de 15 Anos da Piettra"

  const description = `Foto compartilhada por ${photo.user.name || "um convidado"} na Festa de 15 Anos da Piettra`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: photo.createdAt.toISOString(),
      authors: photo.user.name ? [photo.user.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

// Função para obter a foto do banco de dados
async function getPhoto(photoId: string) {
  console.log(photoId)
  if (!photoId) return null

  try {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    return photo
  } catch (error) {
    console.error("Erro ao buscar foto:", error)
    return null
  }
}

export default async function PhotoPage({ params }: Props) {
  const { id } = await params
  console.log('???', id)
  const photo = await getPhoto(id)

  if (!photo) {
    notFound()
  }

  // Função para download da imagem
  async function downloadImage(url: string) {
    // Esta função será implementada no cliente
    return url
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <Link
            href="/fotos"
            className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a galeria
          </Link>

          <h1 className={cn(playfair.className, "text-3xl md:text-4xl font-bold text-pink-800 mb-2")}>
            {photo.caption || "Momento especial"}
          </h1>

          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <time dateTime={photo.createdAt.toISOString()}>
              {formatDistanceToNow(new Date(photo.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </time>
            <span className="mx-2">•</span>
            <span>Compartilhado por {photo.user.name || "Convidado"}</span>
            <span className="mx-2">•</span>
            <span>{photo._count.likes} curtidas</span>
          </div>
        </div>

        {/* Imagem */}
        <div className="relative rounded-lg overflow-hidden shadow-xl mb-8">
          <div className="aspect-square md:aspect-[4/3] w-full relative">
            <Image
              src={photo.url || "/placeholder.svg"}
              alt={photo.caption || "Foto da festa de 15 anos"}
              fill
              className="object-contain bg-black/5"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        </div>

        {/* Botão de download */}
        <div className="flex justify-center">
          <a
            href={photo.url}
            download={`piettra15anos_${new Date().toISOString().split("T")[0]}.jpg`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Download className="h-5 w-5 mr-2" />
            Baixar foto
          </a>
        </div>

        {/* Rodapé */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Festa de 15 Anos da Piettra</p>
          <p className="mt-1">© {new Date().getFullYear()} Todos os direitos reservados</p>
        </div>
      </div>
    </main>
  )
}
