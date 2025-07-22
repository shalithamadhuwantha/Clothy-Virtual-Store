"use client"

import type React from "react"
import { SellerProvider, useSeller } from "./contexts/SellerContext"
import SellerLogin from "./components/SellerLogin"
import SellerNavigation from "./components/SellerNavigation"
import SellerHeader from "./components/SellerHeader"

function SellerLayoutContent({ children }: { children: React.ReactNode }) {
  const { state } = useSeller()

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <SellerLogin />
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Left Navigation */}
      <SellerNavigation />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col h-full">
        {/* Fixed Header */}
        <SellerHeader />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SellerProvider>
      <SellerLayoutContent>{children}</SellerLayoutContent>
    </SellerProvider>
  )
}
