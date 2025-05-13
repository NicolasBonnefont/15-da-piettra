"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type React from "react"

import { isHeicImage } from "@/lib/utils"
import imageCompression from "browser-image-compression"
import { ImagePlus, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { uploadPhoto } from "./actions"

interface PhotoUploadFormProps {
  onSuccess?: () => void
}

export function PhotoUploadForm({ onSuccess }: PhotoUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [caption, setCaption] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const convertHeicToJpeg = async (file: File) => {
    try {
      const heic2any = (await import("heic2any")).default
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8,
      })

      const convertedFile = new File(
        [Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob],
        file.name.replace(/\.heic$/i, ".jpg"),
        { type: "image/jpeg" },
      )

      return convertedFile
    } catch (error) {
      console.error("Erro na conversão HEIC:", error)
      throw new Error("Não foi possível converter a imagem HEIC")
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    let file = e.target.files?.[0] || null

    if (file) {
      try {
        // Se for HEIC, converte antes de comprimir
        if (isHeicImage(file)) {
          file = await convertHeicToJpeg(file)
        }

        // Opções de compressão
        const options = {
          maxSizeMB: 5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        }

        const compressedFile = await imageCompression(file, options)
        setSelectedFile(compressedFile)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(compressedFile)
      } catch {
        setSelectedFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedFile) {
      toast.error("Por favor, selecione uma foto para enviar.")
      return
    }

    setIsUploading(true)

    try {
      await uploadPhoto(selectedFile, caption)

      setCaption("")
      setSelectedFile(null)
      setPreviewUrl(null)

      toast.success("Sua foto foi enviada com sucesso.")

      // Chamar callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess()
      }
    } catch {
      toast.error("Não foi possível enviar sua foto. Tente novamente.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!previewUrl ? (
        <label
          htmlFor="photo"
          className="block border-2 border-dashed border-pink-200 rounded-lg p-8 text-center cursor-pointer transition hover:border-pink-400 focus-within:border-pink-500"
          tabIndex={0}
        >
          <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
            <ImagePlus className="h-10 w-10 text-pink-400" />
            <div className="text-sm text-gray-600">
              <span className="text-pink-600 font-medium">Clique para selecionar</span>
            </div>
          </div>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            tabIndex={-1}
          />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="max-h-80 w-full object-contain mx-auto bg-gray-50"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={() => {
                setSelectedFile(null)
                setPreviewUrl(null)
              }}
            >
              Trocar
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Legenda (opcional)</Label>
            <Textarea
              id="caption"
              placeholder="Adicione uma legenda para sua foto..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border-pink-200 resize-none"
              rows={3}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white"
          disabled={isUploading || !selectedFile}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
            </>
          ) : (
            "Publicar"
          )}
        </Button>
      </div>
    </form>
  )
}
