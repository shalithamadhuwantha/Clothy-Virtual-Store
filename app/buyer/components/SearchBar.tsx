"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, Camera, X } from "lucide-react"
import { useApp } from "../contexts/AppContext"
import Image from "next/image"
import { useRouter } from "next/navigation"

const allProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 89500,
    originalPrice: 119500,
    image: "/placeholder.svg?height=400&width=400",
    description: "High-quality wireless headphones with noise cancellation",
    category: "T Shirt",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    tags: ["wireless", "headphones", "audio"],
  },
  {
    id: "2",
    name: "Minimalist Watch",
    price: 59500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Elegant minimalist watch with premium materials",
    category: "Dress",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    tags: ["watch", "minimalist", "accessory"],
  },
  {
    id: "3",
    name: "Leather Laptop Bag",
    price: 44500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Handcrafted leather laptop bag for professionals",
    category: "Pants",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    tags: ["bag", "leather", "laptop"],
  },
  {
    id: "4",
    name: "Smart Fitness Tracker",
    price: 74500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Advanced fitness tracker with health monitoring",
    category: "T Shirt",
    rating: 4.5,
    reviews: 203,
    inStock: true,
    tags: ["fitness", "tracker", "smart"],
  },
  {
    id: "5",
    name: "Wireless Charging Pad",
    price: 23500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Fast wireless charging pad for all devices",
    category: "T Shirt",
    rating: 4.4,
    reviews: 78,
    inStock: true,
    tags: ["charging", "wireless", "pad"],
  },
  {
    id: "6",
    name: "Premium Coffee Mug",
    price: 8500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Insulated coffee mug with elegant design",
    category: "Home",
    rating: 4.3,
    reviews: 45,
    inStock: true,
    tags: ["mug", "coffee", "premium"],
  },
]

interface SearchBarProps {
  onProductSelect?: (product: any) => void
}

export default function SearchBar({ onProductSelect }: SearchBarProps) {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const searchQuery = state.searchQuery ?? ""
  const [isOpen, setIsOpen] = useState(false)
  type Product = typeof allProducts[number]
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredProducts(filtered)
      dispatch({ type: "SET_SEARCH_RESULTS", payload: filtered })
    } else {
      setFilteredProducts([])
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] })
    }
  }, [searchQuery, dispatch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    dispatch({ type: "SET_SEARCH_QUERY", payload: query })
    setIsOpen(query.length > 0)
  }

  const handleProductClick = (product: any) => {
    setIsOpen(false)
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" })

    // Set selected product and open modal
    dispatch({ type: "SET_SELECTED_PRODUCT", payload: product })
    dispatch({ type: "SET_PRODUCT_MODAL_OPEN", payload: true })

    // Call custom handler if provided
    if (onProductSelect) {
      onProductSelect(product)
    }
  }

  const clearSearch = () => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" })
    setIsOpen(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery && setIsOpen(true)}
          className="w-full pl-12 pr-20 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-black focus:bg-white transition-all duration-200"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {searchQuery && (
            <button onClick={clearSearch} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <button className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
            <Camera className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-3">Found {filteredProducts.length} products</p>
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-black truncate">{product.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{product.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium text-black">{formatPrice(product.price)}</span>
                      <span className="text-xs text-gray-500">{product.category}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery && filteredProducts.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-2xl shadow-2xl z-50 p-6 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No products found for "{searchQuery}"</p>
          <p className="text-sm text-gray-500 mt-1">Try searching with different keywords</p>
        </div>
      )}
    </div>
  )
}
