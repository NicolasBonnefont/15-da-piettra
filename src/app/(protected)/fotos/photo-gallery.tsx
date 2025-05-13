import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import getSession from "@/lib/get-session"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MessageCircle, Share2 } from "lucide-react"
import Image from "next/image"
import { getPhotos } from "./actions"
import { CommentSection } from "./comment-section"
import { DeletePhotoButton } from "./delete-photo-button"
import { LikeButton } from "./like-button"
import { SharePhotoMenu } from "./share-photo-menu"

export async function PhotoGallery() {
  const photos = await getPhotos()
  const session = await getSession()
  const userId = session?.user?.id

  if (photos.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Ainda não há fotos. Seja o primeiro a compartilhar momentos especiais!
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
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
              {userId === photo.userId ? (
                <DeletePhotoButton photoId={photo.id} />
              ) : (
                <button className="text-gray-500 hover:text-gray-700">
                  <Share2 className="h-5 w-5" />
                </button>
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
              priority
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
            <CommentSection photo={photo} currentUserId={userId} />
          </div>
        </Card>
      ))}
    </div>
  )
}
