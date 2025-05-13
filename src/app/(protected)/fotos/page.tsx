import { cn } from "@/lib/utils"
import { Playfair_Display } from "next/font/google"
import { PhotoGallery } from "./photo-gallery"
import { UploadPhotoButton } from "./upload-photo-button"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default async function FotosPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className={cn(playfair.className, "text-4xl font-bold text-pink-800 text-center mb-6")}>Galeria de Fotos</h1>

      {/* Botão de upload centralizado */}
      <div className="flex justify-center mb-10">
        <UploadPhotoButton />
      </div>

      <div className="max-w-xl mx-auto">
        <div className="mt-6">
          <h2 className={cn(playfair.className, "text-2xl font-semibold text-pink-700 mb-6 text-center")}>
            Fotos dos Convidados
          </h2>
          <PhotoGallery />
        </div>
      </div>
    </main>
  )
}
