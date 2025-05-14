"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Camera, ImagePlus, Loader2, Upload } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRef, useState, type ChangeEvent } from "react"
import { toast } from "sonner"
import { uploadPhoto } from "./actions"

export function UploadPhotoButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [caption, setCaption] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Função para lidar com a seleção de arquivos
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    setSelectedFiles((prev) => [...prev, ...newFiles])

    // Gerar previews para os arquivos selecionados
    newFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviews((prev) => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Função para remover um arquivo da seleção
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Função para abrir o seletor de arquivos
  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  // Função para abrir a câmera
  const openCamera = () => {
    cameraInputRef.current?.click()
  }

  // Função para fazer upload das fotos
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Selecione pelo menos uma foto para enviar")
      return
    }

    setIsUploading(true)
    setCurrentFileIndex(0)
    setUploadProgress(0)

    try {
      // Upload de cada arquivo selecionado
      for (let i = 0; i < selectedFiles.length; i++) {
        setCurrentFileIndex(i)

        // Calcular progresso total
        const progressPerFile = 100 / selectedFiles.length
        const baseProgress = i * progressPerFile

        // Fazer upload do arquivo atual
        await uploadPhoto(selectedFiles[i], caption)

        // Atualizar progresso
        setUploadProgress(baseProgress + progressPerFile)
      }

      toast.success(
        selectedFiles.length === 1
          ? "Foto enviada com sucesso!"
          : `${selectedFiles.length} fotos enviadas com sucesso!`,
      )

      // Limpar estado e fechar o modal
      setSelectedFiles([])
      setPreviews([])
      setCaption("")
      setIsOpen(false)

      // Forçar atualização da página para mostrar as novas fotos
      location.reload()
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      toast.error("Não foi possível enviar a(s) foto(s). Tente novamente.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
          <ImagePlus className="h-5 w-5" />
          <span>Compartilhar Fotos</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-pink-800">Compartilhar Fotos</DialogTitle>
          <DialogDescription className="text-center">
            Compartilhe momentos especiais da festa com todos os convidados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Área de preview das imagens */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remover imagem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Botões para selecionar fotos */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={openFilePicker}
              className="flex items-center gap-2 border-pink-200 text-pink-700 hover:bg-pink-50"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              <span>Escolher Fotos</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={openCamera}
              className="flex items-center gap-2 border-pink-200 text-pink-700 hover:bg-pink-50"
              disabled={isUploading}
            >
              <Camera className="h-4 w-4" />
              <span>Usar Câmera</span>
            </Button>

            {/* Input oculto para seleção de arquivos */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />

            {/* Input oculto para câmera */}
            <Input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>

          {/* Campo de legenda */}
          <div className="space-y-2">
            <Label htmlFor="caption">Legenda (opcional)</Label>
            <Textarea
              id="caption"
              placeholder="Adicione uma legenda para sua(s) foto(s)..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none border-pink-200 focus-visible:ring-pink-400"
              disabled={isUploading}
            />
          </div>

          {/* Barra de progresso */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Enviando foto {currentFileIndex + 1} de {selectedFiles.length}
                </span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2 bg-pink-100" indicatorClassName="bg-pink-500" />
            </div>
          )}

          {/* Botão de upload */}
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleUpload}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                </>
              ) : (
                "Enviar Foto(s)"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
