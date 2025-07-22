"use client"

import { useRouter } from "next/navigation"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useApp } from "../contexts/AppContext"
import {
  CreditCard,
  Truck,
  Shield,
  ArrowLeft,
  Check,
  ViewIcon as Visa,
  CreditCardIcon as Mastercard,
  ShoppingCart,
  Lock,
} from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { state, dispatch, formatPrice } = useApp()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState(
    state.addresses.find((addr) => addr.isDefault)?.id || state.addresses[0]?.id || "",
  )
  const [selectedPayment, setSelectedPayment] = useState(
    state.paymentMethods.find((pm) => pm.isDefault)?.id || state.paymentMethods[0]?.id || "",
  )
  const [formData, setFormData] = useState({
    email: state.user?.email || "",
    firstName: state.user?.name?.split(" ")[0] || "",
    lastName: state.user?.name?.split(" ")[1] || "",
    phone: state.user?.phone || "",
    // Address fields
    addressName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka",
    // Payment fields
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push("/buyer")
    }
  }, [state.isAuthenticated, router])

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please login to access the checkout page.</p>
          <Link href="/buyer">
            <Button className="bg-black text-white hover:bg-gray-800 rounded-xl">Go to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Create order
      const newOrder = {
        id: Date.now().toString(),
        items: state.cart.items,
        total: state.cart.total,
        status: "processing" as const,
        orderDate: new Date().toLocaleDateString(),
        shippingAddress: selectedAddress
          ? state.addresses.find((addr) => addr.id === selectedAddress)!
          : {
              id: "temp",
              name: formData.addressName,
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
              isDefault: false,
              type: "other" as const,
            },
        paymentMethod: selectedPayment
          ? state.paymentMethods.find((pm) => pm.id === selectedPayment)!
          : {
              id: "temp",
              type: "card" as const,
              cardNumber: formData.cardNumber,
              cardholderName: formData.nameOnCard,
              isDefault: false,
            },
      }

      dispatch({ type: "ADD_ORDER", payload: newOrder })
      dispatch({ type: "CLEAR_CART" })
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: Date.now().toString(),
          title: "Order Placed Successfully! 🎉",
          message: `Your order #${newOrder.id} has been placed and is being processed. Total: ${formatPrice(newOrder.total)}`,
          type: "success",
          read: false,
          createdAt: new Date().toLocaleString(),
          orderId: newOrder.id,
          actionType: "view_order",
        },
      })

      // Redirect to success page or show success message
      alert("Order placed successfully! Check your profile for order details.")
    }
  }

  if (state.cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-12 border-2 border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart to proceed with checkout.</p>
            <Link href="/buyer/products">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-8 py-4">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const stepTitles = ["Contact Info", "Shipping", "Payment"]
  const tax = state.cart.total * 0.08
  const finalTotal = state.cart.total + tax

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/buyer/products">
            <Button variant="outline" size="icon" className="border-2 border-gray-200 rounded-xl hover:border-black">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-black">Checkout</h1>
            <p className="text-gray-600">Complete your purchase</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= stepNumber ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNumber ? <Check className="h-6 w-6" /> : stepNumber}
                </div>
                <div className="ml-3 mr-6">
                  <p className={`text-sm font-medium ${step >= stepNumber ? "text-black" : "text-gray-500"}`}>
                    {stepTitles[stepNumber - 1]}
                  </p>
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 transition-all ${step > stepNumber ? "bg-black" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-black mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="kasun@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Kasun"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Perera"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+94 77 123 4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-black mb-6">Shipping Address</h2>

                  {/* Saved Addresses */}
                  {state.addresses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-black mb-4">Choose from saved addresses</h3>
                      <div className="space-y-3">
                        {state.addresses.map((address) => (
                          <label
                            key={address.id}
                            className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              selectedAddress === address.id
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="selectedAddress"
                              value={address.id}
                              checked={selectedAddress === address.id}
                              onChange={(e) => setSelectedAddress(e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-black">{address.name}</p>
                                <p className="text-gray-600">{address.street}</p>
                                <p className="text-gray-600">
                                  {address.city}, {address.state} {address.zipCode}
                                </p>
                              </div>
                              {address.isDefault && (
                                <span className="bg-black text-white text-xs px-2 py-1 rounded-full">Default</span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="selectedAddress"
                            value=""
                            checked={selectedAddress === ""}
                            onChange={(e) => setSelectedAddress("")}
                            className="mr-3"
                          />
                          <span className="text-black font-medium">Use a different address</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* New Address Form */}
                  {(state.addresses.length === 0 || selectedAddress === "") && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Name</label>
                        <input
                          type="text"
                          name="addressName"
                          placeholder="Home, Work, etc."
                          value={formData.addressName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                          required={selectedAddress === ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          placeholder="No. 123, Galle Road"
                          value={formData.street}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                          required={selectedAddress === ""}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            placeholder="Colombo"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                            required={selectedAddress === ""}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                          <input
                            type="text"
                            name="state"
                            placeholder="Western Province"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                            required={selectedAddress === ""}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            placeholder="00300"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                            required={selectedAddress === ""}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-black mb-6">Payment Information</h2>

                  {/* Saved Payment Methods */}
                  {state.paymentMethods.length > 0 ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-black mb-4">Choose payment method</h3>
                      <div className="space-y-3">
                        {state.paymentMethods.map((payment) => {
                          let cardIcon = <CreditCard className="h-6 w-6 text-gray-600" />
                          if (payment.type === "card") {
                            if (payment.cardNumber?.startsWith("4")) {
                              cardIcon = <Visa className="h-6 w-6 text-blue-600" />
                            } else if (payment.cardNumber?.startsWith("5")) {
                              cardIcon = <Mastercard className="h-6 w-6 text-yellow-600" />
                            }
                          }

                          return (
                            <label
                              key={payment.id}
                              className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                selectedPayment === payment.id
                                  ? "border-black bg-gray-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name="selectedPayment"
                                value={payment.id}
                                checked={selectedPayment === payment.id}
                                onChange={(e) => setSelectedPayment(e.target.value)}
                                className="sr-only"
                              />
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  {cardIcon}
                                  <div>
                                    <p className="font-semibold text-black">
                                      {payment.type === "card" ? (
                                        <>**** **** **** {payment.cardNumber?.slice(-4)}</>
                                      ) : (
                                        <>{payment.bankName}</>
                                      )}
                                    </p>
                                    <p className="text-gray-600">
                                      {payment.type === "card" ? payment.cardholderName : payment.accountNumber}
                                    </p>
                                  </div>
                                </div>
                                {payment.isDefault && (
                                  <span className="bg-black text-white text-xs px-2 py-1 rounded-full">Default</span>
                                )}
                              </div>
                            </label>
                          )
                        })}
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="selectedPayment"
                            value=""
                            checked={selectedPayment === ""}
                            onChange={(e) => setSelectedPayment("")}
                            className="mr-3"
                          />
                          <span className="text-black font-medium">Use a different payment method</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <p className="text-gray-600">No payment methods saved. Please add a new one.</p>
                    </div>
                  )}

                  {/* New Payment Form */}
                  {(state.paymentMethods.length === 0 || selectedPayment === "") && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          name="nameOnCard"
                          placeholder="Kasun Perera"
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                          required={selectedPayment === ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                          required={selectedPayment === ""}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                            required={selectedPayment === ""}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                            required={selectedPayment === ""}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 border-2 border-gray-200 rounded-xl py-4 text-lg font-semibold hover:border-black"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl py-4 text-lg font-semibold"
                >
                  {step === 3 ? "Place Order" : "Continue"}
                </Button>
              </div>
            </form>

            {/* Security Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 bg-white border-2 border-gray-200 rounded-xl">
                <Shield className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <p className="text-sm font-semibold text-black">Secure Payment</p>
                <p className="text-xs text-gray-600">SSL Encrypted</p>
              </div>
              <div className="text-center p-6 bg-white border-2 border-gray-200 rounded-xl">
                <Truck className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <p className="text-sm font-semibold text-black">Free Shipping</p>
                <p className="text-xs text-gray-600">Island-wide</p>
              </div>
              <div className="text-center p-6 bg-white border-2 border-gray-200 rounded-xl">
                <CreditCard className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <p className="text-sm font-semibold text-black">Easy Returns</p>
                <p className="text-xs text-gray-600">30-day policy</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {state.cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-sm">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-black">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatPrice(state.cart.total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%):</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t-2 border-gray-200 pt-3">
                  <span>Total:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <p className="text-green-800 text-sm font-medium">🚚 Free shipping on all orders within Sri Lanka!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
