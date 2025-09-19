import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Navigation } from "@/src/components/navigation"
import "./globals.css"
import { headers } from "next/headers"
import ContextProvider from "context"

export const metadata: Metadata = {
  title: "Atelia",
  description: "Discover, collect, and trade unique digital assets",
  generator: "v0.app",
  icons : {
    icon : "/fractal-mathematical-digital-art.jpg"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  const headersObj = headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ContextProvider cookies={cookies} children={children}>
          <Navigation />
          <Suspense fallback={null}>
            {children}
          </Suspense>
          <Analytics />
        </ContextProvider>
      </body>
    </html>
  )
}
