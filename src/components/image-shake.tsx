"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { type ReactNode, useEffect, useState } from "react"

interface ImageShakeProps {
  src: string
  alt: string
  className?: string
  children?: ReactNode
  interval?: number // Intervalo em segundos entre os chacoalhos
}

export function ImageShake({ src, alt, className, children, interval = 5 }: ImageShakeProps) {
  const [key, setKey] = useState(0) // Usado para forçar a animação a reiniciar

  // Definir a sequência de animação para o chacoalho
  const shakeAnimation = {
    x: [0, -5, 5, -5, 5, -3, 3, -2, 2, 0],
    y: [0, 3, -3, 2, -2, 3, -3, 1, -1, 0],
    rotate: [2, 1.5, 2.5, 1.5, 2.5, 2, 1.8, 2.2, 1.9, 2],
  }

  // Configurar o intervalo para chacoalhar periodicamente
  useEffect(() => {
    // Função para acionar o chacoalho
    const triggerShake = () => {
      setKey((prev) => prev + 1) // Mudar a key para forçar a animação a reiniciar
    }

    // Configurar o intervalo para chacoalhos periódicos
    const intervalId = setInterval(triggerShake, interval * 1000)

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId)
  }, [interval])

  return (
    <div className={`relative h-full w-full ${className}`}>
      <motion.div
        key={key} // Usar a key para forçar a reinicialização da animação
        className="relative h-full w-full overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500"
        initial={{ rotate: 2 }}
        animate={shakeAnimation}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
        }}
        whileHover={{
          rotate: 0,
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
        <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}
