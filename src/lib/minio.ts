"use server"

import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

// Configuração do cliente MinIO/S3 com valores padrão que funcionam com MinIO local
 const s3Client = new S3Client({
  region: process.env.MINIO_REGION || "us-east-1",
  endpoint: process.env.MINIO_ENDPOINT || "http://localhost:9000",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "minio",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "minio123",
  },
  forcePathStyle: true, // Necessário para MinIO
})

// Bucket padrão
const bucketName = process.env.MINIO_BUCKET_NAME || "fotos"

/**
 * Faz upload de um arquivo para o MinIO e retorna a URL pública
 */
export async function uploadToMinio(file: File, key: string): Promise<string> {
  try {
    // Converter o File para um ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Configurar o comando de upload
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read", // Importante para acesso público
    })

    // Executar o upload
    await s3Client.send(command)

    // Construir e retornar a URL pública
    const publicUrl = `${process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT || "http://localhost:9000"}/${bucketName}/${key}`
    return publicUrl
  } catch (error) {
    console.error("Erro ao fazer upload para o MinIO:", error)
    throw new Error("Falha ao fazer upload da imagem")
  }
}

/**
 * Extrai a chave (nome do arquivo) de uma URL do MinIO
 */
export async function extractKeyFromUrl(url: string) {
  try {
    // Remover o protocolo e o domínio para obter o caminho
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")

    // O último segmento após o nome do bucket é a chave
    // Formato típico: /bucket-name/key
    const bucketIndex = pathParts.findIndex((part) => part === bucketName)
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join("/")
    }

    // Fallback: tentar extrair o último segmento do caminho
    return pathParts[pathParts.length - 1]
  } catch (error) {
    console.error("Erro ao extrair chave da URL:", error)
    // Retornar a URL original como fallback
    return url
  }
}

/**
 * Exclui um arquivo do MinIO
 */
export async function deleteFromMinio(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    await s3Client.send(command)
    return true
  } catch (error) {
    console.error("Erro ao excluir arquivo do MinIO:", error)
    return false
  }
}

