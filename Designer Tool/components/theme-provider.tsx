"use client"

import { ThemeProvider as NextThemeProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider(props: ThemeProviderProps) {
  useEffect(() => {
    // Force light theme on mount
    const html = document.documentElement
    html.classList.remove("dark")
    html.classList.add("light")
    localStorage.setItem("theme", "light")
  }, [])

  return <NextThemeProvider {...props} />
}
