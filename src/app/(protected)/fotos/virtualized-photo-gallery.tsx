"use client"

import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MessageCircle } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getPhotos } from "./actions"
import { CommentSection } from "./comment-section"
import { DeletePhotoButton } from "./delete-photo-button"
import { LikeButton } from "./like-button"
import { SharePhotoMenu } from "./share-photo-menu"

// Importar o tipo Comment para garantir compatibilidade
type Comment = {
  id: string
  content: string
  createdAt: Date
  userId: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

type Photo = {
  id: string
  url: string
  caption: string | null
  createdAt: Date
  likedByMe: boolean
  likesCount: number
  userId: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
  comments: Comment[]
  likes: {
    id: string
    userId: string
  }[]
}

interface VirtualizedPhotoGalleryProps {
  initialPhotos: Photo[]
  currentUserId?: string
}

export function VirtualizedPhotoGallery({ initialPhotos, currentUserId }: VirtualizedPhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialPhotos.length >= 10)
  const PHOTOS_PER_PAGE = 10

  // Referência para o container da lista
  const parentRef = React.useRef<HTMLDivElement>(null)

  // Referências para medir a altura de cada item
  const photoRefs = React.useRef<Record<string, HTMLDivElement | null>>({})

  // Estado para armazenar as alturas medidas
  const [photoHeights, setPhotoHeights] = useState<Record<string, number>>({})

  // Função para estimar a altura de um item
  const estimateSize = React.useCallback(
    (index: number) => {
      // Se for o botão "Carregar mais"
      if (index === photos.length) {
        return 80 // Altura estimada do botão
      }

      const photo = photos[index]
      if (!photo) return 600 // Altura padrão estimada

      // Usar a altura medida ou uma estimativa
      return photoHeights[photo.id] || 600
    },
    [photos, photoHeights],
  )

  // Configuração do virtualizador baseado na janela
  const virtualizer = useWindowVirtualizer({
    count: photos.length + (hasMore ? 1 : 0), // +1 para o botão "Carregar mais"
    estimateSize,
    scrollMargin: typeof window !== "undefined" ? window.innerHeight * 0.1 : 0,
    overscan: 3, // Número de itens para renderizar além da viewport
  })

  // Função para carregar mais fotos
  const loadMorePhotos = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const nextPage = page + 1
      const newPhotos = await getPhotos(nextPage, PHOTOS_PER_PAGE)

      if (newPhotos.length === 0) {
        setHasMore(false)
      } else {
        setPhotos((prev) => [...prev, ...newPhotos])
        setPage(nextPage)
        setHasMore(newPhotos.length >= PHOTOS_PER_PAGE)
      }
    } catch (error) {
      console.error("Erro ao carregar mais fotos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Medir as alturas dos itens após a renderização
  useEffect(() => {
    const newHeights: Record<string, number> = {}
    let hasChanges = false

    photos.forEach((photo) => {
      const element = photoRefs.current[photo.id]
      if (element) {
        const height = element.getBoundingClientRect().height
        if (height > 0 && photoHeights[photo.id] !== height) {
          newHeights[photo.id] = height
          hasChanges = true
        }
      }
    })

    if (hasChanges) {
      setPhotoHeights((prev) => ({ ...prev, ...newHeights }))
    }
  }, [photos, photoHeights])

  // Detectar quando o usuário chega perto do final da lista
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight || document.documentElement.clientHeight

      // Se estiver a 300px do final, carrega mais fotos
      if (scrollHeight - scrollTop - clientHeight < 300 && !isLoading && hasMore) {
        loadMorePhotos()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoading, hasMore])

  if (photos.length === 0 && !isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Ainda não há fotos. Seja o primeiro a compartilhar momentos especiais!
      </div>
    )
  }

  return (
    <div ref={parentRef} className="max-w-xl mx-auto space-y-8">
      <div className="relative w-full">
        {virtualizer.getVirtualItems().map((virtualItem) => {
          // Se for o último item e temos mais fotos para carregar
          if (virtualItem.index === photos.length && hasMore) {
            return (
              <div
                key="load-more"
                className="w-full flex justify-center py-6 my-8"
                style={{
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <Button
                  onClick={loadMorePhotos}
                  disabled={isLoading}
                  variant="outline"
                  className="border-pink-200 text-pink-600 hover:bg-pink-50"
                >
                  {isLoading ? "Carregando..." : "Carregar mais fotos"}
                </Button>
              </div>
            )
          }

          // Renderizar o item da foto
          const photo = photos[virtualItem.index]
          if (!photo) return null

          return (
            <div
              key={photo.id}
              ref={(el) => {
                photoRefs.current[photo.id] = el;
              }}
              className="w-full mb-8"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
              }}
            >
              <Card className="overflow-hidden border-gray-200 rounded-lg shadow-sm">
                {/* Cabeçalho - Usuário e opções */}
                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src={photo.user.image || ""} alt={photo.user.name || "Convidado"} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white text-xs">
                        {photo.user.name?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{photo.user.name || "Convidado"}</span>
                  </div>

                  {/* Menu de opções */}
                  <div className="relative">
                    {currentUserId === photo.userId ? (
                      <DeletePhotoButton photoId={photo.id} />
                    ) : (
                      <SharePhotoMenu photo={photo} />
                    )}
                  </div>
                </div>

                {/* Imagem */}
                <div className="relative aspect-square w-full bg-gray-50">
                  <Image
                    src={photo.url || ""}
                    alt={photo.caption || "Foto da festa"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                    loading="lazy"
                  />
                </div>

                {/* Ações - Curtir, Comentar, Compartilhar */}
                <div className="p-3 pb-0">
                  <div className="flex items-center gap-4 mb-2">
                    <LikeButton photoId={photo.id} initialLiked={photo.likedByMe} />
                    <button className="flex items-center gap-1 text-gray-800 hover:text-gray-600 transition-colors">
                      <MessageCircle className="h-6 w-6" />
                    </button>
                    <SharePhotoMenu photo={photo} />
                  </div>

                  {/* Contador de curtidas */}
                  <div className="text-sm font-medium mb-1">
                    {photo.likesCount > 0
                      ? `${photo.likesCount} curtida${photo.likesCount !== 1 ? "s" : ""}`
                      : "Seja o primeiro a curtir"}
                  </div>
                </div>

                {/* Legenda */}
                {photo.caption && (
                  <div className="px-3 pb-1">
                    <p className="text-sm">
                      <span className="font-medium mr-1.5">{photo.user.name || "Convidado"}</span>
                      {photo.caption}
                    </p>
                  </div>
                )}

                {/* Data */}
                <div className="px-3 pb-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {formatDistanceToNow(new Date(photo.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>

                {/* Comentários */}
                <div className="px-3 pb-3 pt-1">
                  <CommentSection photo={photo} currentUserId={currentUserId} />
                </div>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Espaçador para manter o layout correto */}
      <div style={{ height: virtualizer.getTotalSize() }} />
    </div>
  )
}

// Componente de carregamento para usar enquanto os dados são buscados
export function PhotoGallerySkeleton() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {[1, 2].map((i) => (
        <Card key={i} className="overflow-hidden border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Skeleton className="aspect-square w-full" />

          <div className="p-3">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>
      ))}
    </div>
  )
}
