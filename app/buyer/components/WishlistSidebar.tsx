"use client"

import { X, Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useApp } from "../contexts/AppContext"
import Image from "next/image"

interface WishlistSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function WishlistSidebar({ isOpen, onClose }: WishlistSidebarProps) {
  const { state, dispatch, formatPrice } = useApp()

  const handleAddToCart = (product: any) => {
    dispatch({ type: "ADD_TO_CART", payload: product })
    // Show a brief success message
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        title: "Added to Cart! 🛒",
        message: `${product.name} has been added to your cart.`,
        type: "success",
        read: false,
        createdAt: new Date().toLocaleString(),
      },
    })
  }

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_FAVORITES", payload: productId })
  }

  const handleAddAllToCart = () => {
    state.favorites.forEach((product) => {
      dispatch({ type: "ADD_TO_CART", payload: product })
    })
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        title: "All Items Added to Cart! 🛒",
        message: `${state.favorites.length} items from your wishlist have been added to cart.`,
        type: "success",
        read: false,
        createdAt: new Date().toLocaleString(),
      },
    })
  }

  const totalWishlistValue = state.favorites.reduce((sum, item) => sum + item.price, 0)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-white border-l-2 border-gray-200">
        <SheetHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl sm:text-2xl font-bold text-black flex items-center">
              <Heart className="h-6 w-6 mr-2 text-red-500" />
              My Wishlist
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{state.favorites.length} items</span>
            {state.favorites.length > 0 && (
              <span className="font-semibold">Total: {formatPrice(totalWishlistValue)}</span>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {state.favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-4">Save items you love for later!</p>
              <Button onClick={onClose} className="bg-black text-white hover:bg-gray-800 rounded-xl">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.favorites.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-3 sm:p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl overflow-hidden border border-gray-200">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-black truncate text-sm sm:text-base">{item.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{item.category}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-black">{formatPrice(item.price)}</span>
                      <div className="flex items-center space-x-1">
                        {item.inStock ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">In Stock</span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className="bg-black text-white hover:bg-gray-800 rounded-xl text-xs px-2 py-1.5 sm:px-3 sm:py-1"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs px-2 py-1.5 sm:px-3 sm:py-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.favorites.length > 0 && (
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex items-center justify-between text-base sm:text-lg font-bold text-black">
              <span>Total Value:</span>
              <span>{formatPrice(totalWishlistValue)}</span>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleAddAllToCart}
                className="w-full bg-black text-white hover:bg-gray-800 rounded-xl py-2.5 sm:py-3"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add All to Cart ({state.favorites.length} items)
              </Button>

              <Button variant="outline" onClick={onClose} className="w-full border-2 border-gray-200 rounded-xl py-3">
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
