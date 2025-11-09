import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.remove('dark');
              document.documentElement.classList.add('light');
              localStorage.setItem('theme', 'light');
            `,
          }}
        />
      </head>
      <body className={`${geistSans.className} ${geistMono.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
