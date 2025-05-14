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
      <body className={inter.className}>
        <Navbar />
        {children}
        <BackToTop />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
