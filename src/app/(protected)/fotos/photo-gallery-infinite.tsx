"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { getPhotos } from "./actions"
import { CommentSection } from "./comment-section"
import { DeletePhotoButton } from "./delete-photo-button"
import { LikeButton } from "./like-button"
import { SharePhotoMenu } from "./share-photo-menu"

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

interface PhotoGalleryInfiniteProps {
  initialPhotos: Photo[]
  currentUserId?: string
  onNewPhoto?: (photo: Photo) => void
}

export function PhotoGalleryInfinite({ initialPhotos, currentUserId, onNewPhoto }: PhotoGalleryInfiniteProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialPhotos.length >= 10)
  const loaderRef = useRef<HTMLDivElement>(null)
  const PHOTOS_PER_PAGE = 10

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

  // Função para adicionar uma nova foto ao estado
  const addNewPhoto = (photo: Photo) => {
    setPhotos((prev) => [photo, ...prev])
  }

  // Função para atualizar os comentários de uma foto
  const handleCommentAdded = (photoId: string, newComment: Comment) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) => {
        if (photo.id === photoId) {
          return {
            ...photo,
            comments: [...photo.comments, newComment],
          }
        }
        return photo
      }),
    )
  }

  // Configurar o Intersection Observer para detectar quando o usuário chega ao final da lista
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMorePhotos()
        }
      },
      { rootMargin: "200px" }, // Carregar mais fotos quando estiver a 200px do final
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [hasMore, isLoading, page])

  // Configurar um listener para eventos de nova foto
  useEffect(() => {
    // Registrar o callback para novas fotos
    if (onNewPhoto) {
      window.addEventListener("new-photo-added", ((event: CustomEvent<Photo>) => {
        addNewPhoto(event.detail)
      }) as EventListener)
    }

    // Verificar se há novas fotos a cada 30 segundos
    const checkForNewPhotos = async () => {
      if (photos.length > 0) {
        try {
          const latestPhotos = await getPhotos(1, 5)

          // Verificar se há fotos novas que não estão no estado atual
          const newPhotos = latestPhotos.filter(
            (newPhoto) => !photos.some((existingPhoto) => existingPhoto.id === newPhoto.id),
          )

          if (newPhotos.length > 0) {
            setPhotos((prev) => [...newPhotos, ...prev])
          }
        } catch (error) {
          console.error("Erro ao verificar novas fotos:", error)
        }
      }
    }

    const intervalId = setInterval(checkForNewPhotos, 30000)

    return () => {
      window.removeEventListener("new-photo-added", ((event: CustomEvent<Photo>) => {
        addNewPhoto(event.detail)
      }) as EventListener)
      clearInterval(intervalId)
    }
  }, [photos])

  if (photos.length === 0 && !isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Ainda não há fotos. Seja o primeiro a compartilhar momentos especiais!
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden border-gray-200 rounded-lg shadow-sm">
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
            <CommentSection
              photo={photo}
              currentUserId={currentUserId}
              onCommentAdded={(newComment) => handleCommentAdded(photo.id, newComment)}
            />
          </div>
        </Card>
      ))}

      {/* Loader para carregar mais fotos */}
      <div ref={loaderRef} className="flex justify-center py-8">
        {isLoading ? (
          <Button disabled variant="outline" className="border-pink-200 text-pink-600">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Carregando mais fotos...
          </Button>
        ) : hasMore ? (
          <Button onClick={loadMorePhotos} variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
            Carregar mais fotos
          </Button>
        ) : (
          <p className="text-gray-500 text-sm">Não há mais fotos para carregar</p>
        )}
      </div>
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
