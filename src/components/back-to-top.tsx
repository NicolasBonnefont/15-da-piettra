"use client"

import { ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Função para verificar a posição de rolagem
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Função para rolar para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    // Adiciona o event listener
    window.addEventListener("scroll", toggleVisibility)

    // Limpa o event listener ao desmontar
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </>
  )
}
