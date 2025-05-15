"use client"

import { motion, useAnimation } from "framer-motion"
import Image from "next/image"
import { type ReactNode, useEffect } from "react"

interface ImageShakeProps {
  src: string
  alt: string
  className?: string
  children?: ReactNode
  interval?: number // Intervalo em segundos entre os chacoalhos
}

export function ImageShake({ src, alt, className, children, interval = 5 }: ImageShakeProps) {
  // Usar controles de animação para maior controle
  const controls = useAnimation()

  // Definir a sequência de animação para o chacoalho
  const shakeAnimation = {
    x: [0, -5, 5, -5, 5, -3, 3, -2, 2, 0],
    y: [0, 3, -3, 2, -2, 3, -3, 1, -1, 0],
    rotate: [2, 1.5, 2.5, 1.5, 2.5, 2, 1.8, 2.2, 1.9, 2],
  }

  // Função para executar a animação de chacoalho
  const triggerShake = async () => {
    // Executar a animação de chacoalho
    await controls.start({
      ...shakeAnimation,
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
      },
    })

    // Voltar para o estado de repouso
    await controls.start({ rotate: 2, x: 0, y: 0 })
  }

  // Configurar o intervalo para chacoalhar periodicamente
  useEffect(() => {
    // Chacoalho inicial após um pequeno atraso
    const initialTimeout = setTimeout(() => {
      triggerShake()
    }, 1000)

    // Configurar o intervalo para chacoalhos periódicos
    const intervalId = setInterval(() => {
      triggerShake()
    }, interval * 1000)

    // Limpar timeouts e intervalos quando o componente for desmontado
    return () => {
      clearTimeout(initialTimeout)
      clearInterval(intervalId)
    }
  }, [interval])

  return (
    <div className={`relative h-full w-full ${className}`}>
      <motion.div
        className="relative h-full w-full overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500"
        initial={{ rotate: 2 }}
        animate={controls}
        whileHover={{
          rotate: 0,
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
        <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-contain" />
      </motion.div>
    </div>
  )
}
