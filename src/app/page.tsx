import { Button } from "@/components/ui/button"
import getSession from "@/lib/get-session"
import { cn } from "@/lib/utils"
import { Calendar, Clock, Heart, MapPin, Shirt, Sparkles } from 'lucide-react'
import { Dancing_Script, Playfair_Display } from 'next/font/google'
import Link from "next/link"

import { ImageShake } from "@/components/image-shake"
import { LoginButton } from "@/components/login-button"
import { MultiImageCarousel } from "@/components/multi-image-carousel"
import Countdown from "./count-down"

// Importando fontes elegantes
const playfair = Playfair_Display({ subsets: ["latin"] })
const dancingScript = Dancing_Script({ subsets: ["latin"] })

// Imagens para o carrossel
const carouselImages = Array.from({ length: 16 }, (_, i) => `/pi/old-${i + 1}.jpg`)

export default async function Home() {
  const session = await getSession()

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section Refinada */}
      <section className="w-full relative overflow-hidden min-h-screen flex items-center">
        {/* Background com gradiente mais sofisticado */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 opacity-90"></div>

        {/* Padrão decorativo sutil */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=pattern')] bg-repeat opacity-5"></div>

        {/* Elementos decorativos refinados */}
        <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-tl from-pink-200 to-pink-400 blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-pink-300 blur-2xl opacity-10"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-pink-300 blur-2xl opacity-10"></div>

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
        <div className="absolute top-2/3 left-1/6 w-14 h-14 text-pink-300 animate-float-slow opacity-20">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z M16.59,7.58L10,14.17l-2.59-2.58L6,13l4,4l8-8L16.59,7.58z" />
          </svg>
        </div>
        <div className="absolute top-1/6 right-1/6 w-12 h-12 text-pink-400 animate-float opacity-20">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z" />
          </svg>
        </div>

        <div className="container relative mx-auto px-6 py-16 text-center z-10">
          <div className="max-w-3xl mx-auto">
            {/* Elemento decorativo superior */}
            <div className="mb-8 flex justify-center items-center gap-3">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-pink-400"></div>
              <Sparkles className="h-5 w-5 text-pink-500 animate-pulse" />
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-pink-400"></div>
            </div>

            {/* Pré-título elegante */}
            <div className={cn(dancingScript.className, "text-2xl text-pink-600 mb-4")}>
              Um dia para celebrar um sonho
            </div>

            {/* Título principal refinado */}
            <h1
              className={cn(
                playfair.className,
                "text-5xl md:text-6xl lg:text-7xl font-bold text-pink-800 mb-6 leading-tight",
              )}
            >
              A Festa de 15 Anos de Piettra
            </h1>

            {/* Subtítulo mais envolvente */}
            <p className="text-xl md:text-2xl text-pink-700 mb-12 italic">
              Uma noite mágica para celebrar a vida, as amizades e os sonhos que se tornam realidade.
            </p>

            {/* Contagem regressiva em destaque */}
            <div className="mb-12 bg-white/50 backdrop-blur-sm py-10 px-6 rounded-2xl shadow-lg border border-pink-100">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-pink-400"></div>
                <h2 className={cn(playfair.className, "text-2xl md:text-3xl font-bold text-pink-800")}>
                  Contagem Regressiva
                </h2>
                <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-pink-400"></div>
              </div>

              <p className="text-pink-600 italic mb-8 max-w-xl mx-auto">
                A cada instante, mais perto de celebrar este momento único e especial.
              </p>

              <Countdown />
            </div>

            {/* Botões de ação refinados */}
            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-12">
              {session ? (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full px-10 py-6 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border-none text-base"
                  >
                    <Link href="/mural">Deixe sua Mensagem</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 rounded-full px-10 py-6 shadow-sm hover:shadow transition-all duration-300 hover:translate-y-[-2px] text-base"
                  >
                    <Link href="/fotos">Ver a Galeria de Fotos</Link>
                  </Button>
                </>
              ) : (
                <div className="transform hover:scale-105 transition-transform duration-300 mx-auto">
                  <LoginButton />
                </div>
              )}
            </div>

            {/* Elemento decorativo inferior */}
            <div className="mt-16 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Informações da Festa com design elegante */}
      <section className="container mx-auto py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-pink-100 blur-3xl opacity-70 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-pink-100 blur-3xl opacity-60 -z-10"></div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="mb-4 w-16 h-1 bg-gradient-to-r from-pink-300 to-pink-600"></div>
            <h2 className={cn(playfair.className, "text-3xl md:text-4xl font-bold text-pink-800 mb-6")}>
              Sobre a Festa
            </h2>
            <div className="space-y-6 text-gray-700">
              <p className="text-lg">
                Junte-se a nós para celebrar os 15 anos da Piettra em grande estilo! Uma noite inesquecível com música,
                dança e muita alegria.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-pink-100 transform transition-transform duration-300 hover:translate-y-[-5px]">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 mr-3">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-pink-700">Data</h3>
                  </div>
                  <p className="text-gray-700 pl-11">23 de Maio de 2025</p>
                </div>
                <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-pink-100 transform transition-transform duration-300 hover:translate-y-[-5px]">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 mr-3">
                      <Clock className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-pink-700">Horário</h3>
                  </div>
                  <p className="text-gray-700 pl-11">19:00 - 02:00</p>
                </div>
                <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-pink-100 transform transition-transform duration-300 hover:translate-y-[-5px]">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 mr-3">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-pink-700">Local</h3>
                  </div>
                  <p className="text-gray-700 pl-11">Salão de Festas Ilha de Capri</p>
                </div>
                <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-pink-100 transform transition-transform duration-300 hover:translate-y-[-5px]">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 mr-3">
                      <Shirt className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-pink-700">Traje</h3>
                  </div>
                  <p className="text-gray-700 pl-11">Esporte Fino</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="h-[500px] rounded-2xl overflow-hidden">
              <ImageShake
                src="/pi/pi-2.jpeg"
                alt="Piettra"
                className="rounded-2xl"
                interval={7}
              >
                <div className="absolute inset-0 border-8 border-white z-10 rounded-2xl"></div>
              </ImageShake>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Fotos com carrossel infinito */}
      <section className="w-full bg-gradient-to-b from-pink-50 to-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=4ne3x')] bg-cover opacity-5"></div>

        <div className="container mx-auto px-2 relative z-10">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-1 bg-gradient-to-r from-pink-300 to-pink-600 mb-4"></div>
            <h2 className={cn(playfair.className, "text-3xl md:text-4xl font-bold text-pink-800 mb-4 text-center")}>
              Momentos Especiais
            </h2>
            <p className="text-pink-600 italic text-center max-w-xl mb-10">
              Memórias que contam a história de uma jornada incrível até os 15 anos
            </p>
          </div>

          {/* Carrossel de imagens */}
          <MultiImageCarousel images={carouselImages} />
        </div>
      </section>

      {/* Nova seção: Citação */}
      <section className="container mx-auto py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl text-pink-300 mb-6">"</div>
          <p className={cn(playfair.className, "text-xl md:text-2xl text-pink-800 italic mb-6")}>
            Quinze anos é o momento em que deixamos para trás a infância e começamos a escrever nossa própria história.
            É um marco que celebramos com aqueles que amamos.
          </p>
          <div className="w-16 h-1 bg-pink-300 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Piettra</p>
        </div>
      </section>

      {/* Footer elegante */}
      <footer className="w-full bg-gradient-to-b from-white to-pink-50 py-10 px-4 text-center">
        <div className="container mx-auto">
          <p className="text-pink-700 mb-2">Festa de 15 Anos da Piettra</p>
          <p className="text-pink-500 text-sm">23 de Maio de 2025</p>
        </div>
      </footer>

      {/* Estilos para animações */}
     
    </main>
  )
}