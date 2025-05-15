import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Festa de 15 Anos da Piettra";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right bottom, #fbcfe8, #f9a8d4)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #ec4899, #db2777)",
              padding: 12,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              background: "linear-gradient(to right, #be185d, #831843)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
            }}
          >
            Piettra
          </h1>
        </div>
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#be185d",
            margin: 0,
            marginBottom: 16,
          }}
        >
          Festa de 15 Anos
        </h2>
        <p
          style={{
            fontSize: 24,
            color: "#9d174d",
            margin: 0,
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          Uma noite inesquecível para celebrar sonhos, memórias e novos começos
        </p>
        <div
          style={{
            marginTop: 48,
            padding: 16,
            background: "rgba(255, 255, 255, 0.4)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#be185d",
              margin: 0,
            }}
          >
            23 de Maio de 2025 • 19:00
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
