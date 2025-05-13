"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

type CarouselProps = {
  images: string[]
}

export function MultiImageCarousel({ images }: CarouselProps) {
  // Initialize Embla with autoplay options
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    align: "start",
  })

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // Navigate in lightbox
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
                  className="relative w-full max-h-[440px] mx-auto cursor-pointer transform transition-transform hover:scale-[1.02] rounded-xl overflow-hidden"
                  style={{
                    aspectRatio: "3/4",
                    maxWidth: `${440 * (3 / 4)}px`, // 330px - calculated from max-height and aspect ratio
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
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 z-50 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
              onClick={handleLightboxClose}
            >
              <X className="h-6 w-6 text-white" />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={images[currentImage] || "/placeholder.svg"}
                alt={`Visualização em tela cheia ${currentImage + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${currentImage === index ? "bg-white w-4" : "bg-white/50"
                    }`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
