"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type React from "react"

import { isHeicImage } from "@/lib/utils"
import imageCompression from "browser-image-compression"
import { useState } from "react"
import { toast } from "sonner"
import { uploadPhoto } from "./actions"

export function PhotoUploadForm() {
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
    } catch {
      toast.error("Não foi possível enviar sua foto. Tente novamente.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="photo">Selecione uma foto</Label>
        <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="border-pink-200" />
      </div>

      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Preview"
            className="max-h-60 rounded-lg object-contain mx-auto"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="caption">Legenda (opcional)</Label>
        <Textarea
          id="caption"
          placeholder="Adicione uma legenda para sua foto..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border-pink-200"
        />
      </div>

      <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isUploading || !selectedFile}>
        {isUploading ? "Enviando..." : "Enviar Foto"}
      </Button>
    </form>
  )
}
