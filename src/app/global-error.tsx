'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertTriangle, Heart, RotateCw } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'
import { useEffect } from "react"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar o erro no console ou em um serviço de monitoramento
    console.error(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <main className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <div className="text-center z-10 max-w-md mx-auto">
            <div className="mb-4 flex justify-center">
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-2 rounded-lg">
                <Heart className="h-8 w-8" />
              </div>
            </div>

            <div className="mb-6 flex justify-center">
              <AlertTriangle className="h-16 w-16 text-pink-600" />
            </div>

            <h1 className={cn(playfair.className, "text-3xl md:text-4xl font-bold text-pink-800 mb-6")}>
              Algo deu errado
            </h1>

            <p className="text-pink-700 mb-8 text-lg">
              Desculpe, ocorreu um erro inesperado. Vamos tentar novamente?
            </p>

            <Button
              onClick={() => reset()}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full px-8 py-6 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border-none text-base"
            >
              <RotateCw className="h-5 w-5 mr-2" />
              <span>Tentar novamente</span>
            </Button>
          </div>
        </main>
      </body>
    </html>
  )
}