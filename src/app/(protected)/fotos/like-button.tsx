"use client"

import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { toggleLike } from "./actions"

interface LikeButtonProps {
  photoId: string
  initialLiked: boolean
}

export function LikeButton({ photoId, initialLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [isLoading, setIsLoading] = useState(false)

  async function handleToggleLike() {
    if (isLoading) return

    setIsLoading(true)

    try {
      // Otimistic UI update
      setLiked(!liked)

      const result = await toggleLike(photoId)

      // Caso a resposta do servidor seja diferente do estado otimista
      if (result.liked !== !initialLiked) {
        setLiked(result.liked)
      }
    } catch (error) {
      // Reverter para o estado anterior em caso de erro
      setLiked(initialLiked)
      toast.error("Não foi possível processar sua ação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-1 transition-all duration-300",
        liked ? "text-pink-600 hover:text-pink-500" : "text-gray-800 hover:text-pink-600",
      )}
    >
      <Heart className={cn("h-6 w-6 transition-all duration-300", liked && "fill-current animate-heartbeat")} />
    </button>
  )
}
