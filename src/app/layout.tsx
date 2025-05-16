import { BackToTop } from "@/components/back-to-top"
import { Navbar } from "@/components/navbar"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Festa de 15 Anos da Piettra",
  description: "Celebre este momento especial conosco!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <body className={inter.className}>
        <Navbar />
        {children}
        <BackToTop />
        <Toaster position="top-center" />
        <script defer src="http://umami-vo0o4kokcscg80s0ggo08480.31.97.18.31.sslip.io/script.js" data-website-id="6bad5060-28d9-4c7d-9b3c-232b627baabf"></script>
      </body>
    </html>
  )
}
