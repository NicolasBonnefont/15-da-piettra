import getSession from "@/lib/get-session"
import { cn } from "@/lib/utils"
import { Camera, Download, FileText, Heart, MessageSquare } from 'lucide-react'
import { Dancing_Script, Playfair_Display } from 'next/font/google'
import Link from "next/link"

const playfair = Playfair_Display({ subsets: ["latin"] })
const dancingScript = Dancing_Script({ subsets: ["latin"] })

export default async function Dashboard() {
  const session = await getSession()

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 py-16 px-4 relative overflow-hidden">
      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-1/4 left-1/5 w-20 h-20 text-pink-300 animate-float opacity-20">
        <Heart className="w-full h-full" />
      </div>
      <div className="absolute top-1/3 right-1/5 w-16 h-16 text-pink-400 animate-float-delayed opacity-20">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 left-1/3 w-24 h-24 text-pink-200 animate-float-slow opacity-20">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
      <div className="absolute bottom-1/3 right-1/3 w-16 h-16 text-pink-300 animate-float-delayed opacity-20">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.66,10.25l-9.84-9.64a.51.51,0,0,0-.17-.1.62.62,0,0,0-.19,0,.22.22,0,0,0-.09,0,.59.59,0,0,0-.17.09L2.34,10.25a.75.75,0,0,0,0,1.06.74.74,0,0,0,1.06,0L4,10.75V19.5a2,2,0,0,0,2,2h5.5V16.75a1,1,0,0,1,1-1h1a1,1,0,0,1,1,1V21.5H20a2,2,0,0,0,2-2V10.75l.6.56a.74.74,0,0,0,1.06,0A.75.75,0,0,0,21.66,10.25Z" />
        </svg>
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <div className="mb-4 flex justify-center">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-2 rounded-lg">
              <Heart className="h-8 w-8" />
            </div>
          </div>

          <div className={cn(dancingScript.className, "text-2xl text-pink-600 mb-2")}>
            Bem-vindo(a), {session.user?.name?.split(' ')[0] || 'Convidado(a)'}!
          </div>

          <h1 className={cn(playfair.className, "text-4xl md:text-5xl font-bold text-pink-800 mb-6")}>
            Festa de 15 Anos da Piettra
          </h1>

          <p className="text-pink-700 max-w-2xl mx-auto">
            Escolha uma das opções abaixo para participar desta celebração especial.
            Você pode deixar uma mensagem no mural, ver as fotos da galeria ou baixar o cardápio da festa.
          </p>
        </div>

        {/* Cards de opções */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Mural de Mensagens */}
          <Link href="/mural" className="group">
            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100 h-full flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-5px]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white mb-6">
                <MessageSquare className="h-8 w-8" />
              </div>

              <h2 className={cn(playfair.className, "text-2xl font-bold text-pink-800 mb-4")}>
                Mural de Mensagens
              </h2>

              <p className="text-pink-700 mb-6 flex-grow">
                Deixe uma mensagem especial para a Piettra. Compartilhe seus desejos, memórias e palavras de carinho neste dia tão importante.
              </p>

              <span className="inline-flex items-center text-pink-600 font-medium group-hover:text-pink-700 transition-colors">
                Ir para o Mural
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Card 2: Galeria de Fotos */}
          <Link href="/fotos" className="group">
            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100 h-full flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-5px]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white mb-6">
                <Camera className="h-8 w-8" />
              </div>

              <h2 className={cn(playfair.className, "text-2xl font-bold text-pink-800 mb-4")}>
                Galeria de Fotos
              </h2>

              <p className="text-pink-700 mb-6 flex-grow">
                Veja e compartilhe fotos da festa. Capture momentos especiais e ajude a construir um álbum de memórias inesquecíveis.
              </p>

              <span className="inline-flex items-center text-pink-600 font-medium group-hover:text-pink-700 transition-colors">
                Ver Galeria
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Card 3: Cardápio da Festa */}
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100 h-full flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white mb-6">
              <FileText className="h-8 w-8" />
            </div>

            <h2 className={cn(playfair.className, "text-2xl font-bold text-pink-800 mb-4")}>
              Cardápio da Festa
            </h2>

            <p className="text-pink-700 mb-6 flex-grow">
              Confira o menu especial preparado para a celebração. Deliciosas opções de comidas e bebidas para tornar a noite ainda mais especial.
            </p>

            <a
              href="/cardapio.jpeg"
              download="Cardapio_Festa_15_Anos_Piettra.jpeg"
              className="inline-flex items-center bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] animate-pulse-subtle"
            >
              <Download className="h-5 w-5 mr-2" />
              Baixar Cardápio
            </a>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center text-pink-600">
          <p>Festa de 15 Anos da Piettra</p>
          <p className="text-sm mt-1">23 de Maio de 2025</p>
        </div>
      </div>


    </main>
  )
}