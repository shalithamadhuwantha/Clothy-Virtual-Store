"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from "lucide-react"
import { useSeller } from "../contexts/SellerContext"
import Link from "next/link"

export default function SellerWishlist() {
  const { state, dispatch, formatPrice } = useSeller()

  const removeFromFavorites = (id: string) => {
    dispatch({ type: "REMOVE_FROM_FAVORITES", payload: id })
  }

  const addToCart = (product: any) => {
    dispatch({ type: "ADD_TO_CART", payload: product })
  }

  const isInCart = (productId: string) => {
    return state.cart.items.some((item) => item.id === productId)
  }

  if (state.favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">Save items you love to your wishlist</p>
            <Link href="/seller/shop">
              <Button className="bg-black text-white hover:bg-gray-800">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">My Wishlist</h1>
          <p className="text-gray-600">
            {state.favorites.length} {state.favorites.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.favorites.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                      onClick={() => removeFromFavorites(product.id)}
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg text-black line-clamp-2 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-black">{formatPrice(product.price)}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                    {product.brand && <Badge variant="outline">{product.brand}</Badge>}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isInCart(product.id) ? "Added" : "Add to Cart"}
                    </Button>
                    <Button
                      onClick={() => removeFromFavorites(product.id)}
                      variant="outline"
                      size="sm"
                      className="px-3 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/seller/shop">
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
