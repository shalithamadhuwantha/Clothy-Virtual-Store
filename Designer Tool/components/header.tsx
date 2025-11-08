"use client"

import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        
      </div>
      {/* Theme toggle button */}
      <ThemeToggle />
    </div>
  )
}
