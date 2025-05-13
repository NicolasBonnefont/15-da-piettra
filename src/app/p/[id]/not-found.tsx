import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PhotoNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 text-pink-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-pink-800 mb-3">Foto não encontrada</h1>
        <p className="text-gray-600 mb-8">A foto que você está procurando não existe ou foi removida.</p>
        <Link
          href="/fotos"
          className="inline-flex items-center bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para a galeria
        </Link>
      </div>
    </div>
  )
}
