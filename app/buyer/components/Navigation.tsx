"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { User, Menu, ShoppingBag, Heart, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useApp } from "../contexts/AppContext"
import SearchBar from "./SearchBar"
import CartSidebar from "./CartSidebar"
import WishlistSidebar from "./WishlistSidebar"
import AuthModal from "./AuthModal"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [isScrolled, setIsScrolled] = useState(false)
  const { state, dispatch } = useApp()
  const pathname = usePathname()

  const navItems = [
    { href: "/buyer", label: "Home" },
    { href: "/buyer/products", label: "Products" },
    { href: "/buyer/about", label: "About" },
    { href: "/buyer/contact", label: "Contact" },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActiveRoute = (href: string) => {
    if (href === "/buyer") {
      return pathname === "/buyer"
    }
    return pathname.startsWith(href)
  }

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleCartClick = () => {
    if (!state.isAuthenticated) {
      setAuthMode("login")
      setIsAuthModalOpen(true)
      return
    }
    setIsCartOpen(true)
  }

  const handleWishlistClick = () => {
    if (!state.isAuthenticated) {
      setAuthMode("login")
      setIsAuthModalOpen(true)
      return
    }
    setIsWishlistOpen(true)
  }

  return (
    <>
      <nav
        className={`fixed top-4 left-4 right-4 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl border border-gray-200/50"
            : "bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/30"
        } rounded-2xl`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/buyer" className="text-2xl p-2 font-bold text-black hover:text-gray-600 transition-colors">
              Clothy Virtual
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 relative ${
                    isActiveRoute(item.href)
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:text-black hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
              {state.isAuthenticated ? (
                <>
                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-100 rounded-xl transition-all duration-200"
                    onClick={handleWishlistClick}
                  >
                    <Heart className="h-5 w-5" />
                    {state.favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                        {state.favorites.length}
                      </span>
                    )}
                  </Button>

                  {/* Cart Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-100 rounded-xl transition-all duration-200"
                    onClick={handleCartClick}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {state.cart.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                        {state.cart.itemCount}
                      </span>
                    )}
                  </Button>

                  {/* Profile Button */}
                  <Link href="/buyer/profile">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-xl transition-all duration-200 ${
                        isActiveRoute("/buyer/profile") ? "bg-black text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {/* Login Button */}
                  <Button
                    variant="ghost"
                    onClick={() => handleAuthClick("login")}
                    className="hidden sm:flex items-center space-x-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>

                  {/* Register Button */}
                  <Button
                    onClick={() => handleAuthClick("register")}
                    className="hidden sm:flex items-center space-x-2 bg-black text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Button>

                  {/* Mobile Auth Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAuthClick("login")}
                    className="sm:hidden hover:bg-gray-100 rounded-xl"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100 rounded-xl">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-white border-l-2 border-gray-200 w-80">
                  <div className="flex flex-col space-y-6 mt-8">
                    <div className="md:hidden">
                      <SearchBar />
                    </div>
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-xl font-medium transition-colors px-4 py-2 rounded-xl ${
                          isActiveRoute(item.href)
                            ? "bg-black text-white"
                            : "text-black hover:text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}

                    {!state.isAuthenticated && (
                      <div className="space-y-3 pt-4 border-t border-gray-200">
                        <Button
                          onClick={() => {
                            handleAuthClick("login")
                            setIsOpen(false)
                          }}
                          variant="outline"
                          className="w-full border-2 border-gray-200 rounded-xl"
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                        <Button
                          onClick={() => {
                            handleAuthClick("register")
                            setIsOpen(false)
                          }}
                          className="w-full bg-black text-white hover:bg-gray-800 rounded-xl"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Register
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {state.isAuthenticated && (
        <>
          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
        </>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}
