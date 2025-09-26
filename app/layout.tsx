import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Navigation } from "@/src/components/navigation"
import "./globals.css"
import { TRPCReactProvider } from "@/src/trpc/react"
import AppKitProvider from "@/src/context/app-kit"
import { headers } from "next/headers"
import { SpeedInsights } from '@vercel/speed-insights/next';


export const metadata: Metadata = {
  title: "Atelia",
  description: "Discover, collect, and trade unique digital assets",
  generator: "v0.app",
  icons: {
    icon: "/fractal-mathematical-digital-art.jpg"
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const headersObj = await headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AppKitProvider cookies={cookies}>
          <TRPCReactProvider>
            <Navigation />
            <Suspense fallback={null}>
              {children}
              <SpeedInsights />
            </Suspense>
            <Analytics />
          </TRPCReactProvider>
        </AppKitProvider>
      </body>
    </html>
  )
}
