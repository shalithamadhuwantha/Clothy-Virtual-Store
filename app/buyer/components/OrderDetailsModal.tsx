"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Package, MapPin, CreditCard, Truck, Calendar, FileText, Phone } from "lucide-react"
import { useApp } from "../contexts/AppContext"

export default function OrderDetailsModal() {
  const { state, dispatch, formatPrice } = useApp()
  const { selectedOrder, isOrderDetailsModalOpen } = state

  if (!isOrderDetailsModalOpen || !selectedOrder) return null

  const handleClose = () => {
    dispatch({ type: "SET_ORDER_DETAILS_MODAL_OPEN", payload: false })
    dispatch({ type: "SET_SELECTED_ORDER", payload: null })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "confirmed":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return "✅"
      case "shipped":
        return "🚚"
      case "confirmed":
        return "✔️"
      case "processing":
        return "⏳"
      case "cancelled":
        return "❌"
      default:
        return "📦"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl mx-4 sm:mx-6 lg:mx-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-black">Order Details</h2>
                <p className="text-gray-600">Order #{selectedOrder.id}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-xl hover:bg-gray-100">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Order Status */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4">Order Status</h3>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                  selectedOrder.status,
                )}`}
              >
                {getStatusIcon(selectedOrder.status)}{" "}
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Order Date</p>
                  <p className="text-base font-semibold text-black">{selectedOrder.orderDate}</p>
                </div>
              </div>

              {selectedOrder.trackingNumber && (
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                    <p className="text-base font-semibold text-black">{selectedOrder.trackingNumber}</p>
                  </div>
                </div>
              )}

              {selectedOrder.deliveryDate && (
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Delivered On</p>
                    <p className="text-base font-semibold text-black">{selectedOrder.deliveryDate}</p>
                  </div>
                </div>
              )}
            </div>

            {selectedOrder.estimatedDelivery && !selectedOrder.deliveryDate && (
              <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <p className="text-blue-800 font-medium">📅 {selectedOrder.estimatedDelivery}</p>
              </div>
            )}

            {selectedOrder.orderNotes && (
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <div className="flex items-start space-x-2">
                  <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Delivery Notes</p>
                    <p className="text-yellow-700">{selectedOrder.orderNotes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Items Ordered</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border-2 border-gray-200">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-black">{item.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      <span className="text-sm text-gray-600">Category: {item.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg sm:text-xl font-bold text-black">{formatPrice(item.price * item.quantity)}</p>
                    {item.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(item.originalPrice * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Shipping Address */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-6 w-6 text-black" />
                <h3 className="text-lg sm:text-xl font-bold text-black">Shipping Address</h3>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-black">{selectedOrder.shippingAddress.name}</p>
                <p className="text-gray-700">{selectedOrder.shippingAddress.street}</p>
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                </p>
                <p className="text-gray-700">{selectedOrder.shippingAddress.zipCode}</p>
                <p className="text-gray-700">{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="h-6 w-6 text-black" />
                <h3 className="text-lg sm:text-xl font-bold text-black">Payment Method</h3>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-black">
                  {selectedOrder.paymentMethod.type === "card" ? "Credit/Debit Card" : "Bank Transfer"}
                </p>
                {selectedOrder.paymentMethod.cardNumber && (
                  <p className="text-gray-700">**** **** **** {selectedOrder.paymentMethod.cardNumber.slice(-4)}</p>
                )}
                {selectedOrder.paymentMethod.cardholderName && (
                  <p className="text-gray-700">{selectedOrder.paymentMethod.cardholderName}</p>
                )}
                {selectedOrder.paymentMethod.bankName && (
                  <p className="text-gray-700">{selectedOrder.paymentMethod.bankName}</p>
                )}
                {selectedOrder.paymentMethod.accountNumber && (
                  <p className="text-gray-700">Account: ****{selectedOrder.paymentMethod.accountNumber.slice(-4)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg sm:text-xl font-bold text-black mb-6">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  Subtotal ({selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} items)
                </span>
                <span className="text-lg font-semibold text-black">{formatPrice(selectedOrder.total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Shipping</span>
                <span className="text-lg font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tax (VAT)</span>
                <span className="text-lg font-semibold text-black">Included</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-black">Total Paid</span>
                  <span className="text-2xl font-bold text-black">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {selectedOrder.trackingNumber && (
              <Button className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl py-3 sm:py-4 text-base sm:text-lg font-semibold">
                <Truck className="mr-2 h-5 w-5" />
                Track Package
              </Button>
            )}

            {selectedOrder.status === "delivered" && (
              <Button
                variant="outline"
                className="flex-1 border-2 border-gray-200 hover:border-black rounded-xl py-3 sm:py-4 text-base sm:text-lg font-semibold"
              >
                <Package className="mr-2 h-5 w-5" />
                Reorder Items
              </Button>
            )}

            <Button
              variant="outline"
              className="flex-1 border-2 border-gray-200 hover:border-black rounded-xl py-3 sm:py-4 text-base sm:text-lg font-semibold"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
