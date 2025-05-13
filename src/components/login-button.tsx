"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { LogIn } from 'lucide-react'
import { useState } from "react"

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await authClient.signIn.social({
        provider: "google"
      })
    } catch (error) {
      console.error("Erro ao fazer login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      size="lg"
      className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border-none flex items-center gap-2"
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <LogIn className="h-5 w-5" />
      )}
      Entrar na Festa
    </Button>
  )
}
