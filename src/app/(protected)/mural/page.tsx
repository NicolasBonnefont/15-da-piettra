import { cn } from "@/lib/utils"
import { Playfair_Display } from "next/font/google"
import { MessageButton } from "./message-button"
import { MessageList } from "./message-list"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default async function MuralPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto mt-4">
        {/* Cabeçalho com estilo elegante */}
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-pink-300 to-pink-600"></div>
          </div>
          <h1
            className={cn(
              playfair.className,
              "text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-700 to-pink-900 bg-clip-text text-transparent mb-4",
            )}
          >
            Mural de Mensagens
          </h1>
          <p className="text-lg text-pink-600 italic max-w-2xl mx-auto">
            Deixe uma mensagem especial para a Piettra neste dia tão importante. Suas palavras ficarão guardadas para
            sempre em suas memórias.
          </p>
        </div>

        {/* Botão centralizado para abrir o modal de mensagem */}
        <div className="flex justify-center mb-16">
          <MessageButton />
        </div>

        {/* Lista de mensagens */}
        <div className="mt-10">
          <h2 className={cn(playfair.className, "text-2xl font-semibold text-pink-800 mb-8 text-center")}>
            Mensagens dos Convidados
          </h2>
          <MessageList />
        </div>
      </div>
    </main>
  )
}
