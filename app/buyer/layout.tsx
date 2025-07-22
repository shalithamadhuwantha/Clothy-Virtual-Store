"use client"

import type React from "react"

import { AppProvider } from "./contexts/AppContext"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import OrderDetailsModal from "./components/OrderDetailsModal"

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-24">{children}</main>
        <Footer />
        <OrderDetailsModal />
      </div>
    </AppProvider>
  )
}
