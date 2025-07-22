"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "../contexts/AppContext"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { state, dispatch, formatPrice } = useApp()

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id })
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white z-50 transform transition-transform duration-300 shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-black" />
              <h2 className="text-lg sm:text-xl font-bold text-black">Shopping Cart</h2>
              <span className="bg-black text-white text-sm px-2 py-1 rounded-full font-bold">
                {state.cart.itemCount}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {state.cart.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-base sm:text-lg mb-2 font-semibold">Your cart is empty</p>
                <p className="text-gray-500 text-sm mb-6">Add some products to get started</p>
                <Button onClick={onClose} className="bg-black text-white hover:bg-gray-800 rounded-xl font-semibold">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.cart.items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-2xl p-3 sm:p-4 border-2 border-gray-200">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white border-2 border-gray-200">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-black mb-1 text-xs sm:text-sm leading-tight">{item.name}</h3>
                        <p className="text-base sm:text-lg font-bold text-black mb-2 sm:mb-3">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-white rounded-lg border-2 border-gray-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                            >
                              <Minus className="h-4 w-4 text-black" />
                            </button>
                            <span className="px-3 py-2 font-bold text-black min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                            >
                              <Plus className="h-4 w-4 text-black" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.cart.items.length > 0 && (
            <div className="border-t-2 border-gray-200 p-4 sm:p-6 space-y-4 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(state.cart.total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Shipping:</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl font-bold border-t-2 border-gray-300 pt-2">
                  <span className="text-black">Total:</span>
                  <span className="text-black">{formatPrice(state.cart.total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/buyer/checkout" onClick={onClose}>
                  <Button
                    size="lg"
                    className="w-full bg-black text-white hover:bg-gray-800 rounded-xl py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg"
                  >
                    Checkout - {formatPrice(state.cart.total)}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onClose}
                  className="w-full border-2 border-gray-200 hover:border-black rounded-xl py-4 text-lg font-semibold"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
