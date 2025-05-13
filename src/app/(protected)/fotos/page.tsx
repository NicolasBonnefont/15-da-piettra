import { PhotoGallery } from "./photo-gallery"
import { PhotoUploadForm } from "./photo-upload-form"

export default async function FotosPage() {

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-pink-800 text-center mb-10">Galeria de Fotos</h1>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">Compartilhe suas fotos</h2>
          <PhotoUploadForm />
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-pink-700 mb-6">Fotos dos Convidados</h2>
          <PhotoGallery />
        </div>
      </div>
    </main>
  )
}
