"use client"

import type React from "react"

import Image from "next/image"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "../contexts/AppContext"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  brand?: string
  inStock: boolean
  tags: string[]
}

interface ProductCardProps {
  product: Product
  onProductClick?: (product: Product) => void
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { state, dispatch, formatPrice } = useApp()

  const isFavorite = state.favorites.some((fav) => fav.id === product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!state.isAuthenticated) {
      toast.error("Please login to add items to cart")
      return
    }
    dispatch({ type: "ADD_TO_CART", payload: product })
    toast.success(`${product.name} added to cart!`)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!state.isAuthenticated) {
      toast.error("Please login to add items to wishlist")
      return
    }

    if (isFavorite) {
      dispatch({ type: "REMOVE_FROM_FAVORITES", payload: product.id })
      toast.success("Removed from wishlist")
    } else {
      dispatch({ type: "ADD_TO_FAVORITES", payload: product })
      toast.success("Added to wishlist!")
    }
  }

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onProductClick) {
      onProductClick(product)
    } else {
      dispatch({ type: "SET_SELECTED_PRODUCT", payload: product })
      dispatch({ type: "SET_PRODUCT_MODAL_OPEN", payload: true })
    }
  }

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product)
    } else {
      dispatch({ type: "SET_SELECTED_PRODUCT", payload: product })
      dispatch({ type: "SET_PRODUCT_MODAL_OPEN", payload: true })
    }
  }

  return (
    <div
      className="group bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Out of Stock</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleToggleFavorite}
            className={`rounded-full shadow-lg ${
              isFavorite ? "bg-red-500 text-white hover:bg-red-600" : "bg-white hover:bg-gray-100"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            onClick={handleViewProduct}
            className="rounded-full shadow-lg bg-white hover:bg-gray-100"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Brand Badge */}
        {product.brand && (
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white px-2 py-1 rounded-full text-xs font-semibold">{product.brand}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-500 font-medium">{product.category}</span>
        </div>

        <h3 className="font-bold text-lg text-black mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-black">{formatPrice(product.price)}</span>

          {product.inStock && <span className="text-sm text-green-600 font-semibold">In Stock</span>}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl py-3 font-semibold transition-all duration-200"
        >
          {product.inStock ? (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          ) : (
            "Out of Stock"
          )}
        </Button>
      </div>
    </div>
  )
}
