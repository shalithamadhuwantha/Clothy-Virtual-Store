"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSeller } from "../contexts/SellerContext"

const pageNames: Record<string, string> = {
  "/seller/dashboard": "Dashboard",
  "/seller/products": "My Products",
  "/seller/orders": "Orders",
  "/seller/settings": "Settings",
}

export default function SellerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { state } = useSeller()

  const currentPageName = pageNames[pathname] || "Seller Dashboard"

  return (
    <>
      {/* Fixed Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 lg:static">
        {/* Mobile Menu Button & Page Title */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentPageName}</h1>
            <p className="text-sm text-gray-500 hidden sm:block">Welcome back, {state.seller?.name}</p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button> */}

          {/* Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">{state.seller?.name}</span>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  )
}
