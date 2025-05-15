"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

// Hook personalizado para detectar dispositivos móveis
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Verificação inicial
    const media = window.matchMedia(query)
    setMatches(media.matches)

    // Listener para mudanças
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    // Limpeza
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

type CarouselProps = {
  images: string[]
}

export function MultiImageCarousel({ images }: CarouselProps) {
  // Detectar se é dispositivo móvel
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Initialize Embla with autoplay options
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    align: "start",
  })

  // Carrossel para o lightbox
  const [lightboxRef, lightboxApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  })

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sincronizar o índice atual com o carrossel do lightbox
  useEffect(() => {
    if (lightboxApi && lightboxOpen) {
      lightboxApi.scrollTo(currentImage)
    }
  }, [currentImage, lightboxApi, lightboxOpen])

  // Atualizar o índice atual quando o usuário desliza no lightbox
  useEffect(() => {
    if (!lightboxApi) return

    const onSelect = () => {
      setCurrentImage(lightboxApi.selectedScrollSnap())
    }

    lightboxApi.on("select", onSelect)
    return () => {
      lightboxApi.off("select", onSelect)
    }
  }, [lightboxApi])

  // Function to start autoplay
  const startAutoplay = useCallback(() => {
    if (!emblaApi || lightboxOpen) return

    // Clear any existing interval
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
    }

    // Start new interval
    autoplayIntervalRef.current = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, 3000)
  }, [emblaApi, lightboxOpen])

  // Function to stop autoplay
  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
      autoplayIntervalRef.current = null
    }
  }, [])

  // Initialize autoplay
  useEffect(() => {
    startAutoplay()

    return () => {
      stopAutoplay()
    }
  }, [emblaApi, lightboxOpen, startAutoplay, stopAutoplay])

  // Pause autoplay on hover
  useEffect(() => {
    if (!emblaApi) return

    const emblaNode = emblaApi.rootNode()
    const handleMouseEnter = () => stopAutoplay()
    const handleMouseLeave = () => startAutoplay()

    emblaNode.addEventListener("mouseenter", handleMouseEnter)
    emblaNode.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      emblaNode.removeEventListener("mouseenter", handleMouseEnter)
      emblaNode.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [emblaApi, startAutoplay, stopAutoplay])

  // Navigation functions
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Lightbox navigation functions
  const lightboxPrev = useCallback(() => {
    if (lightboxApi) lightboxApi.scrollPrev()
    else prevImage()
  }, [lightboxApi])

  const lightboxNext = useCallback(() => {
    if (lightboxApi) lightboxApi.scrollNext()
    else nextImage()
  }, [lightboxApi])

  // Open lightbox with specific image
  const openLightbox = (index: number) => {
    setCurrentImage(index)
    setLightboxOpen(true)
    // Stop autoplay when lightbox is open
    stopAutoplay()
  }

  // Handle lightbox close
  const handleLightboxClose = () => {
    setLightboxOpen(false)
    // Resume autoplay when lightbox is closed
    startAutoplay()
  }

  // Navigate in lightbox (fallback for when lightboxApi is not available)
  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const nextImage = () => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  return (
    <>
      <div className="relative">
        {/* Carousel navigation */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white/90 transition-colors"
          onClick={scrollPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 text-pink-600" />
        </button>

        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white/90 transition-colors"
          onClick={scrollNext}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 text-pink-600" />
        </button>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="min-w-0 pl-4 flex-[0_0_33.33%] lg:flex-[0_0_33.33%] md:flex-[0_0_33.33%] sm:flex-[0_0_50%] xs:flex-[0_0_100%]"
              >
                <div
                  className="relative w-full mx-auto cursor-pointer transform transition-transform hover:scale-[1.02] rounded-xl overflow-hidden"
                  style={{
                    aspectRatio: "3/4",
                    maxHeight: isMobile ? "520px" : "440px", // Altura maior em dispositivos móveis
                    maxWidth: isMobile ? "100%" : `${440 * (3 / 4)}px`, // Largura ajustada para manter proporção
                  }}
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Momento especial ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={handleLightboxClose}>
        <DialogContent className="max-w-screen-lg w-[90vw] h-[90vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full">
            {/* Botão de fechar */}
            <button
              className="absolute top-4 right-4 z-50 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
              onClick={handleLightboxClose}
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Botões de navegação */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
              onClick={lightboxPrev}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
              onClick={lightboxNext}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Indicadores de swipe (visíveis apenas em dispositivos móveis) */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-4 md:hidden">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 animate-pulse-slow">
                <ChevronLeft className="h-6 w-6 text-white/70" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 animate-pulse-slow animation-delay-500">
                <ChevronRight className="h-6 w-6 text-white/70" />
              </div>
            </div>

            {/* Carrossel do lightbox */}
            <div className="w-full h-full overflow-hidden" ref={lightboxRef}>
              <div className="flex h-full">
                {images.map((src, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`Visualização em tela cheia ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority={index === currentImage}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicadores de página */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${currentImage === index ? "bg-white w-4" : "bg-white/50"
                    }`}
                  onClick={() => {
                    setCurrentImage(index)
                    if (lightboxApi) lightboxApi.scrollTo(index)
                  }}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Estilos para animações */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animation-delay-500 {
          animation-delay: 1.5s;
        }
      `}</style>
    </>
  )
}