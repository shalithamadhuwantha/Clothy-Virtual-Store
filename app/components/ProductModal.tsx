"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, ShoppingCart, Heart, Eye, Plus, Minus, Package, Shield, Truck } from "lucide-react"

interface ProductModalProps {
  product: any
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!isOpen || !product) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    // Handle add to cart logic
    onClose()
  }

  const handleToggleFavorite = () => {
    // Handle toggle favorite logic
  }

  const images = [
    product.image,
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ]

  const features = [
    "Premium Quality Materials",
    "1 Year International Warranty",
    "Free Shipping Island-wide",
    "30-Day Return Policy",
    "24/7 Customer Support",
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto mx-4 sm:mx-6 lg:mx-8">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-3 sm:p-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-black">Product Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square border-2 border-gray-200 rounded-2xl overflow-hidden">
                <Image
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-1 sm:gap-2 lg:gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square border-2 rounded-xl overflow-hidden transition-all ${
                      selectedImage === index ? "border-black" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
                      {product.brand}
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-4">{product.name}</h1>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                  {formatPrice(product.price)}
                </span>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-lg font-semibold text-black">Quantity:</span>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="rounded-l-xl"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-semibold text-black min-w-[3rem] text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-r-xl"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  size="lg"
                  className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 rounded-xl py-3 sm:py-4 text-base sm:text-lg font-semibold"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.inStock ? `Add to Cart - ${formatPrice(product.price * quantity)}` : "Out of Stock"}
                </Button>
                <Button
                  onClick={handleToggleFavorite}
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-200 rounded-xl py-4"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-gray-200 rounded-xl py-4">
                  <Eye className="h-5 w-5" />
                  <span className="ml-2">AR</span>
                </Button>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>

              <div>
                <h3 className="text-xl font-bold text-black mb-3">Key Features</h3>
                <ul className="space-y-1 sm:space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Tags */}
              {product.tags && (
                <div>
                  <h3 className="text-lg font-bold text-black mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 border-2 border-gray-200 rounded-2xl bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-600" />
                    <div>
                      <span className="font-semibold text-black">Availability:</span>
                      <span className={`ml-2 font-semibold ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-gray-600" />
                    <div>
                      <span className="font-semibold text-black">Shipping:</span>
                      <span className="ml-2 text-gray-600">Free Island-wide</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <div>
                      <span className="font-semibold text-black">Warranty:</span>
                      <span className="ml-2 text-gray-600">1 Year</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-600" />
                    <div>
                      <span className="font-semibold text-black">Returns:</span>
                      <span className="ml-2 text-gray-600">30-Day Policy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
