// app/dashboard/loading.tsx
import { cn } from "@/lib/utils"
import { Heart } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-2 rounded-lg animate-pulse">
            <Heart className="h-8 w-8" />
          </div>
        </div>

        <h1 className={cn(playfair.className, "text-3xl font-bold text-pink-800 mb-6")}>
          Carregando...
        </h1>

        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-400 animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 rounded-full bg-pink-600 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  )
}