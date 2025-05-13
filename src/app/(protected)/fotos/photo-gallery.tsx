import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import getSession from "@/lib/get-session"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"
import { getPhotos } from "./actions"
import { CommentSection } from "./comment-section"
import { DeletePhotoButton } from "./delete-photo-button"

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden border-pink-100">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={photo.user.image || ""} alt={photo.user.name || "Convidado"} />
                <AvatarFallback className="bg-pink-200 text-pink-700">
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

            {/* Mostrar botão de exclusão apenas para o autor da foto */}
            {userId === photo.userId && <DeletePhotoButton photoId={photo.id} />}
          </CardHeader>

          <CardContent className="p-0">
            <div className="relative aspect-square w-full">
              <Image src={photo.url || ""} alt={photo.caption || "Foto da festa"} fill className="object-cover" />
            </div>

            {photo.caption && (
              <div className="p-4 pt-3">
                <p className="text-gray-700">{photo.caption}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="block p-4 pt-0">
            <CommentSection photo={photo} currentUserId={userId} />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
