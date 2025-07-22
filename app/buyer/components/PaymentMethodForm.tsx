"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, Lock } from "lucide-react"

interface PaymentMethodFormProps {
  onSave: (paymentMethod: any) => void
  onCancel: () => void
  initialData?: any
}

export default function PaymentMethodForm({ onSave, onCancel, initialData }: PaymentMethodFormProps) {
  const [formData, setFormData] = useState({
    cardNumber: initialData?.cardNumber || "",
    cardholderName: initialData?.cardholderName || "",
    expiryDate: initialData?.expiryDate || "",
    cvv: "",
    cardType: initialData?.cardType || "visa",
    isDefault: initialData?.isDefault || false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const cardTypes = [
    { value: "visa", label: "Visa", pattern: /^4[0-9]{12}(?:[0-9]{3})?$/ },
    { value: "mastercard", label: "Mastercard", pattern: /^5[1-5][0-9]{14}$/ },
    { value: "amex", label: "American Express", pattern: /^3[47][0-9]{13}$/ },
  ]

  const validateCardNumber = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "")
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return "Card number must be between 13-19 digits"
    }

    // Luhn algorithm validation
    let sum = 0
    let isEven = false
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(cleanNumber.charAt(i), 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      sum += digit
      isEven = !isEven
    }

    if (sum % 10 !== 0) {
      return "Invalid card number"
    }

    return ""
  }

  const validateExpiryDate = (date: string) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!regex.test(date)) {
      return "Invalid format (MM/YY)"
    }

    const [month, year] = date.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    const expYear = Number.parseInt(year, 10)
    const expMonth = Number.parseInt(month, 10)

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return "Card has expired"
    }

    return ""
  }

  const validateCVV = (cvv: string) => {
    if (cvv.length < 3 || cvv.length > 4) {
      return "CVV must be 3-4 digits"
    }
    if (!/^\d+$/.test(cvv)) {
      return "CVV must contain only numbers"
    }
    return ""
  }

  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, "")
    const groups = cleanValue.match(/.{1,4}/g) || []
    return groups.join(" ").substr(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length >= 2) {
      return cleanValue.substr(0, 2) + "/" + cleanValue.substr(2, 2)
    }
    return cleanValue
  }

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "")
    for (const type of cardTypes) {
      if (type.pattern.test(cleanNumber)) {
        return type.value
      }
    }
    return "visa"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    let formattedValue = value

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value)
      const detectedType = detectCardType(formattedValue)
      setFormData((prev) => ({ ...prev, cardType: detectedType }))
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value)
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substr(0, 4)
    } else if (name === "cardholderName") {
      formattedValue = value.toUpperCase()
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : formattedValue,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    // Validate all fields
    const cardNumberError = validateCardNumber(formData.cardNumber)
    if (cardNumberError) newErrors.cardNumber = cardNumberError

    const expiryError = validateExpiryDate(formData.expiryDate)
    if (expiryError) newErrors.expiryDate = expiryError

    const cvvError = validateCVV(formData.cvv)
    if (cvvError) newErrors.cvv = cvvError

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const paymentMethodData = {
        ...formData,
        cardNumber: formData.cardNumber.replace(/\s/g, ""),
        type: "card" as const,
      }
      onSave(paymentMethodData)
    }
  }

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "💳"
      case "mastercard":
        return "💳"
      case "amex":
        return "💳"
      default:
        return "💳"
    }
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
      <h3 className="text-xl font-bold text-black mb-6 flex items-center">
        <CreditCard className="h-6 w-6 mr-2" />
        {initialData ? "Edit Payment Method" : "Add New Payment Method"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
          <input
            type="text"
            name="cardholderName"
            placeholder="KASUN PERERA"
            value={formData.cardholderName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
              errors.cardholderName ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"
            }`}
            required
          />
          {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
          <div className="relative">
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.cardNumber ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"
              }`}
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl">
              {getCardIcon(formData.cardType)}
            </div>
          </div>
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
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
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.expiryDate ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"
              }`}
              required
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
            <input
              type="password"
              name="cvv"
              placeholder="123"
              value={formData.cvv}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.cvv ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"
              }`}
              required
            />
            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isDefault"
            id="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          />
          <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
            Set as default payment method
          </label>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-blue-800 text-sm font-medium">Secure Payment</p>
              <p className="text-blue-600 text-xs">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-2 border-gray-200 rounded-xl py-3"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl py-3">
            {initialData ? "Update Payment Method" : "Add Payment Method"}
          </Button>
        </div>
      </form>
    </div>
  )
}
