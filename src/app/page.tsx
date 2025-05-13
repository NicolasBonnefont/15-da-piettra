import { Button } from "@/components/ui/button"
import getSession from "@/lib/get-session"
import { cn } from "@/lib/utils"
import { Calendar, Clock, MapPin, Shirt } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'
import Image from "next/image"
import Link from "next/link"

import { LoginButton } from "@/components/login-button"
import { MultiImageCarousel } from "@/components/multi-image-carousel"
import Countdown from "./count-down"

// Importando fonte elegante para títulos
const playfair = Playfair_Display({ subsets: ["latin"] })

// Imagens para o carrossel
const carouselImages = Array.from({ length: 14 }, (_, i) => `/pi/old-${i + 1}.jpg`)

export default async function Home() {
  const session = await getSession()

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section com background mais elegante e contagem regressiva integrada */}
      <section className="w-full relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-pink-200 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=ql2aw')] bg-cover opacity-10"></div>

        {/* Elementos decorativos */}
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl opacity-40"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-pink-300 blur-3xl opacity-30"></div>

        <div className="container relative mx-auto px-4 py-20 text-center z-10">
          <div className="max-w-3xl mx-auto">
            {/* Elemento decorativo */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-1 bg-gradient-to-r from-pink-300 to-pink-600"></div>
            </div>

            <h1
              className={cn(
                playfair.className,
                "text-5xl md:text-6xl lg:text-7xl font-bold text-pink-800 mb-6 leading-tight",
              )}
            >
              Festa de 15 Anos da Piettra
            </h1>

            <p className="text-xl md:text-2xl text-pink-700 mb-10 italic">
              Venha celebrar este momento especial conosco!
            </p>

            {/* Contagem Regressiva movida para cima */}
            <div className="mb-10">
              <h2 className={cn(playfair.className, "text-2xl md:text-3xl font-bold text-pink-800 mb-4")}>
                Contagem Regressiva
              </h2>
              <p className="text-pink-600 italic mb-6 max-w-xl mx-auto">
                Cada segundo nos aproxima deste momento especial
              </p>
              <Countdown />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
              {session ? (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border-none"
                  >
                    <Link href="/mural">Deixar uma Mensagem</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 rounded-full px-8 shadow-sm hover:shadow transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    <Link href="/fotos">Ver Fotos</Link>
                  </Button>
                </>
              ) : (
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <LoginButton />
                </div>
              )}
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
                  <p className="text-gray-700 pl-11">15 de Junho de 2025</p>
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
                  <p className="text-gray-700 pl-11">Salão de Festas Elegance</p>
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
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 border-8 border-white z-10 rounded-2xl"></div>
              <Image src="/pi/1.png" alt="Piettra" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Fotos com carrossel infinito */}
      <section className="w-full bg-gradient-to-b from-pink-50 to-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=4ne3x')] bg-cover opacity-5"></div>

        <div className="container mx-auto px-4 relative z-10">
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

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border-none"
            >
              <Link href="/fotos">Ver Galeria Completa</Link>
            </Button>
          </div>
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
          <p className="text-pink-500 text-sm">15 de Junho de 2025</p>
        </div>
      </footer>
    </main>
  )
}
