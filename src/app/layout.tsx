import { BackToTop } from "@/components/back-to-top"
import { Navbar } from "@/components/navbar"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
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
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-title" content="MyWebSite" />
      <link rel="manifest" href="/manifest.webmanifest" />
      <body className={inter.className}>
        <Navbar />
        {children}
        <Script defer src="http://umami-vo0o4kokcscg80s0ggo08480.31.97.18.31.sslip.io/script.js" data-website-id="6bad5060-28d9-4c7d-9b3c-232b627baabf" />
        <BackToTop />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
