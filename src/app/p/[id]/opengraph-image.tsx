import { prisma } from "@/lib/prisma"
import { ImageResponse } from "next/og"

// Rota para gerar imagens de preview para OpenGraph
export const runtime = "edge"
export const alt = "Foto da Festa de 15 Anos da Piettra"
export const contentType = "image/png"
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image({ params }: { params: { photoId: string } }) {
  try {
    // Buscar a foto pelo ID
    const photo = await prisma.photo.findUnique({
      where: { id: params.photoId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!photo) {
      // Retornar uma imagem padrão se a foto não for encontrada
      return new ImageResponse(
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#FDF2F8",
            color: "#BE185D",
            fontFamily: "sans-serif",
            padding: 40,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 60, fontWeight: "bold", margin: 0 }}>Festa de 15 Anos da Piettra</h1>
          <p style={{ fontSize: 30, margin: "20px 0" }}>Foto não encontrada</p>
        </div>,
        { ...size },
      )
    }

    // Criar uma imagem com a foto e informações
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#FDF2F8",
          color: "#BE185D",
          fontFamily: "sans-serif",
          padding: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "20px 0",
            borderBottom: "1px solid #FBCFE8",
          }}
        >
          <h1 style={{ fontSize: 36, fontWeight: "bold", margin: 0 }}>Festa de 15 Anos da Piettra</h1>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "80%",
            height: "70%",
            marginTop: 80,
            position: "relative",
            overflow: "hidden",
            borderRadius: 12,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Não podemos usar a imagem externa diretamente aqui, então usamos um placeholder */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#F9A8D4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 24,
            }}
          >
            Clique para ver a foto
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            textAlign: "center",
            maxWidth: "80%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {photo.caption || "Foto compartilhada na Festa de 15 Anos da Piettra"}
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 18,
            color: "#9D174D",
          }}
        >
          Compartilhado por {photo.user.name || "Convidado"}
        </div>
      </div>,
      { ...size },
    )
  } catch (error) {
    // Em caso de erro, retornar uma imagem padrão
    console.error("Erro ao gerar imagem OpenGraph:", error)
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#FDF2F8",
          color: "#BE185D",
          fontFamily: "sans-serif",
          padding: 40,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 60, fontWeight: "bold", margin: 0 }}>Festa de 15 Anos da Piettra</h1>
        <p style={{ fontSize: 30, margin: "20px 0" }}>Compartilhe momentos especiais</p>
      </div>,
      { ...size },
    )
  }
}
