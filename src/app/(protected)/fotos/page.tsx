import getSession from "@/lib/get-session"
import { Suspense } from "react"
import { getPhotos } from "./actions"
import { PhotoGalleryInfinite, PhotoGallerySkeleton } from "./photo-gallery-infinite"
import { UploadPhotoButton } from "./upload-photo-button"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function FotosPage() {
  const session = await getSession()
  const photos = await getPhotos()

  return (
    <main className="container mx-auto py-8 px-4 mt-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-pink-800 mb-4 text-center">Galeria de Fotos</h1>
        <p className="text-gray-600 mb-6 text-center max-w-2xl">
          Compartilhe e veja os momentos especiais da festa. Todas as fotos enviadas serão exibidas aqui.
        </p>
        {session && <UploadPhotoButton />}
      </div>

      <Suspense fallback={<PhotoGallerySkeleton />}>
        <PhotoGalleryInfinite initialPhotos={photos} currentUserId={session?.user?.id} />
      </Suspense>
    </main>
  )
}
