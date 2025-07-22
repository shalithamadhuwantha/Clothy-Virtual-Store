import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clothy Virtual - Premium Shopping Experience",
  description:
    "Discover premium products with Clothy Virtual. Shop T Shirt, Dress, and more with fast delivery and excellent customer service.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <div className="min-h-screen bg-white">{children}</div>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
