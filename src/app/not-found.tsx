'use client'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Heart, Home } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'
import Link from "next/link"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 text-pink-300 animate-float opacity-20">
        <Heart className="w-full h-full" />
      </div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 text-pink-400 animate-float-delayed opacity-30">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 left-1/3 w-24 h-24 text-pink-200 animate-float-slow opacity-20">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
      <div className="absolute bottom-1/3 right-1/3 w-16 h-16 text-pink-300 animate-float-delayed opacity-30">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.66,10.25l-9.84-9.64a.51.51,0,0,0-.17-.1.62.62,0,0,0-.19,0,.22.22,0,0,0-.09,0,.59.59,0,0,0-.17.09L2.34,10.25a.75.75,0,0,0,0,1.06.74.74,0,0,0,1.06,0L4,10.75V19.5a2,2,0,0,0,2,2h5.5V16.75a1,1,0,0,1,1-1h1a1,1,0,0,1,1,1V21.5H20a2,2,0,0,0,2-2V10.75l.6.56a.74.74,0,0,0,1.06,0A.75.75,0,0,0,21.66,10.25Z" />
        </svg>
      </div>

      <div className="text-center z-10 max-w-md mx-auto">
        <div className="mb-4 flex justify-center">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-2 rounded-lg">
            <Heart className="h-8 w-8" />
          </div>
        </div>

        <h1 className={cn(playfair.className, "text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent mb-2")}>
          404
        </h1>

        <h2 className={cn(playfair.className, "text-3xl md:text-4xl font-bold text-pink-800 mb-6")}>
          Página não encontrada
        </h2>

        <p className="text-pink-700 mb-8 text-lg">
          Ops! Parece que você está procurando uma página que não existe.
          Talvez ela tenha ido dançar em outra festa!
        </p>

        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full px-8 py-6 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border-none text-base animate-pulse-subtle"
        >
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span>Voltar para a página inicial</span>
          </Link>
        </Button>
      </div>

      {/* Estilos para animações */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}