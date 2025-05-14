"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Countdown() {
  // Data atualizada para 23 de Maio de 2025 às 19:00
  const partyDate = new Date("2025-05-23T19:00:00")
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const now = new Date()
    const diff = partyDate.getTime() - now.getTime()
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Função para formatar números com zero à esquerda
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0")
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      <CountdownItem value={formatNumber(timeLeft.days)} label="Dias" />
      <CountdownItem value={formatNumber(timeLeft.hours)} label="Horas" />
      <CountdownItem value={formatNumber(timeLeft.minutes)} label="Minutos" />
      <CountdownItem value={formatNumber(timeLeft.seconds)} label="Segundos" />
    </div>
  )
}

function CountdownItem({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-pink-100"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    >
      <div className="w-28 h-28 flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200">
        <motion.div
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-4xl font-bold text-pink-800"
        >
          {value}
        </motion.div>
      </div>
      <div className="bg-white py-2 px-4 text-center">
        <div className="text-pink-600 font-medium">{label}</div>
      </div>
    </motion.div>
  )
}
