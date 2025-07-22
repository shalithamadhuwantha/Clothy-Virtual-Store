"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import ProductModal from "./ProductModal"
import { useApp } from "../contexts/AppContext"

const featuredProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 89500,
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Experience premium audio quality with advanced noise cancellation technology and exceptional comfort for all-day wear.",
    category: "T Shirt",
    brand: "AudioTech",
    inStock: true,
    tags: ["wireless", "noise-cancelling", "premium", "bluetooth"],
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 67500,
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and 7-day battery life.",
    category: "T Shirt",
    brand: "FitTech",
    inStock: true,
    tags: ["smartwatch", "fitness", "gps", "health"],
  },
  {
    id: "3",
    name: "Leather Laptop Bag",
    price: 22500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Handcrafted genuine leather laptop bag with multiple compartments and premium finishing.",
    category: "Pants",
    brand: "LeatherCraft",
    inStock: true,
    tags: ["leather", "laptop", "professional", "handcrafted"],
  },
  {
    id: "4",
    name: "Wireless Charging Pad",
    price: 8500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicators.",
    category: "T Shirt",
    brand: "ChargeTech",
    inStock: true,
    tags: ["wireless", "charging", "qi", "fast-charge"],
  },
]

export default function FeaturedProducts() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const { state, dispatch, formatPrice } = useApp()

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: "ADD_TO_CART", payload: product })
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        title: "Added to Cart! 🛒",
        message: `${product.name} has been added to your cart for ${formatPrice(product.price)}.`,
        type: "success",
        read: false,
        createdAt: new Date().toLocaleString(),
      },
    })
  }

  const handleToggleFavorite = (product: any, e: React.MouseEvent) => {
    e.stopPropagation()
    const isFavorite = state.favorites.some((fav) => fav.id === product.id)

    if (isFavorite) {
      dispatch({ type: "REMOVE_FROM_FAVORITES", payload: product.id })
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: Date.now().toString(),
          title: "Removed from Favorites 💔",
          message: `${product.name} has been removed from your favorites.`,
          type: "info",
          read: false,
          createdAt: new Date().toLocaleString(),
        },
      })
    } else {
      dispatch({ type: "ADD_TO_FAVORITES", payload: product })
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: Date.now().toString(),
          title: "Added to Favorites! ❤️",
          message: `${product.name} has been added to your favorites.`,
          type: "success",
          read: false,
          createdAt: new Date().toLocaleString(),
        },
      })
    }
  }

  const isFavorite = (productId: string) => {
    return state.favorites.some((fav) => fav.id === productId)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full flex flex-col"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => handleToggleFavorite(product, e)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                    isFavorite(product.id)
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white shadow-md"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                </button>
                {!product.inStock && (
                  <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">{product.description}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-black">{formatPrice(product.price)}</span>
                  </div>

                  <Button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={!product.inStock}
                    className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 rounded-xl py-3 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  )
}
