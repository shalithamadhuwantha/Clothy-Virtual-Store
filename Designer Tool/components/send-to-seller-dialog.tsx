"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface SendToSellerDialogProps {
  designImage: string | null
  onSuccess?: () => void
}

export function SendToSellerDialog({ designImage, onSuccess }: SendToSellerDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  })

  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  })

  const handleUserDetailsChange = (field: string, value: string) => {
    setUserDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDeliveryDetailsChange = (field: string, value: string) => {
    setDeliveryDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    if (!userDetails.name.trim()) {
      setError("Name is required")
      return false
    }
    if (!userDetails.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!userDetails.phone.trim()) {
      setError("Phone is required")
      return false
    }
    if (!deliveryDetails.address.trim()) {
      setError("Address is required")
      return false
    }
    if (!deliveryDetails.city.trim()) {
      setError("City is required")
      return false
    }
    if (!deliveryDetails.state.trim()) {
      setError("State is required")
      return false
    }
    if (!deliveryDetails.postalCode.trim()) {
      setError("Postal Code is required")
      return false
    }
    if (!deliveryDetails.country.trim()) {
      setError("Country is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!designImage) {
      setError("Please create a design first")
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/send-design", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          designImage,
          userDetails,
          deliveryDetails,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send design")
        setLoading(false)
        return
      }

      setSuccess(true)
      setUserDetails({
        name: "",
        email: "",
        phone: "",
        company: "",
      })
      setDeliveryDetails({
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      })

      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError("An error occurred while sending the design")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!designImage) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" size="lg">
          <Send className="w-4 h-4 mr-2" />
          Send to Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Design to Seller</DialogTitle>
          <DialogDescription>Fill in your details and delivery information to send your design</DialogDescription>
        </DialogHeader>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-semibold">✓ Design sent successfully!</p>
            <p className="text-sm">The seller will receive your design shortly.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">✗ Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Details */}
          <Card className="p-4 bg-gray-50 dark:bg-gray-800 border-0">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Your Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={userDetails.name}
                  onChange={(e) => handleUserDetailsChange("name", e.target.value)}
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={userDetails.email}
                  onChange={(e) => handleUserDetailsChange("email", e.target.value)}
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+94 712345678"
                  value={userDetails.phone}
                  onChange={(e) => handleUserDetailsChange("phone", e.target.value)}
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-sm font-medium">
                  Company (Optional)
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your Company"
                  value={userDetails.company}
                  onChange={(e) => handleUserDetailsChange("company", e.target.value)}
                  className="mt-1"
                  disabled={loading}
                />
              </div>
            </div>
          </Card>

          {/* Delivery Details */}
          <Card className="p-4 bg-gray-50 dark:bg-gray-800 border-0">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Delivery Address</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  Street Address *
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main Street"
                  value={deliveryDetails.address}
                  onChange={(e) => handleDeliveryDetailsChange("address", e.target.value)}
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">
                    City *
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Mihinthale"
                    value={deliveryDetails.city}
                    onChange={(e) => handleDeliveryDetailsChange("city", e.target.value)}
                    className="mt-1"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="state" className="text-sm font-medium">
                    State/Province *
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="NC"
                    value={deliveryDetails.state}
                    onChange={(e) => handleDeliveryDetailsChange("state", e.target.value)}
                    className="mt-1"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium">
                    Postal Code *
                  </Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="12345"
                    value={deliveryDetails.postalCode}
                    onChange={(e) => handleDeliveryDetailsChange("postalCode", e.target.value)}
                    className="mt-1"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="Sri Lanka"
                    value={deliveryDetails.country}
                    onChange={(e) => handleDeliveryDetailsChange("country", e.target.value)}
                    className="mt-1"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 min-w-32">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Design
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
