"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AddressFormProps {
  onSave: (address: any) => void
  onCancel: () => void
  initialData?: any
}

export default function AddressForm({ onSave, onCancel, initialData }: AddressFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    street: initialData?.street || "",
    city: initialData?.city || "Colombo",
    state: initialData?.state || "Western Province",
    zipCode: initialData?.zipCode || "",
    country: "Sri Lanka",
    type: initialData?.type || "home",
  })

  const sriLankanProvinces = [
    "Western Province",
    "Central Province",
    "Southern Province",
    "Northern Province",
    "Eastern Province",
    "North Western Province",
    "North Central Province",
    "Uva Province",
    "Sabaragamuwa Province",
  ]

  const majorCities = [
    "Colombo",
    "Kandy",
    "Galle",
    "Jaffna",
    "Negombo",
    "Anuradhapura",
    "Batticaloa",
    "Trincomalee",
    "Kurunegala",
    "Ratnapura",
    "Matara",
    "Badulla",
    "Kalutara",
    "Puttalam",
    "Kegalle",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
      <h3 className="text-xl font-bold text-black mb-6">{initialData ? "Edit Address" : "Add New Address"}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Home, Office, Parents' House"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
          <input
            type="text"
            name="street"
            placeholder="e.g., No. 123, Galle Road"
            value={formData.street}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              required
            >
              {majorCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              required
            >
              {sriLankanProvinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
            <input
              type="text"
              name="zipCode"
              placeholder="e.g., 00300"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <input
            type="text"
            name="country"
            value="Sri Lanka"
            disabled
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
          />
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
            {initialData ? "Update Address" : "Save Address"}
          </Button>
        </div>
      </form>
    </div>
  )
}
