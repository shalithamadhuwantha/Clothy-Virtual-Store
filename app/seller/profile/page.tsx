"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Store, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X } from "lucide-react"
import { useSeller } from "../contexts/SellerContext"

export default function SellerProfile() {
  const { state, dispatch } = useSeller()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: state.seller?.name || "",
    email: state.seller?.email || "",
    phone: state.seller?.phone || "",
    businessName: state.seller?.businessName || "",
    businessAddress: state.seller?.businessAddress || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    dispatch({ type: "UPDATE_SELLER_PROFILE", payload: formData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: state.seller?.name || "",
      email: state.seller?.email || "",
      phone: state.seller?.phone || "",
      businessName: state.seller?.businessName || "",
      businessAddress: state.seller?.businessAddress || "",
    })
    setIsEditing(false)
  }

  if (!state.seller) return null

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal and business information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-black mb-2">{state.seller.name}</h2>
                <p className="text-gray-600 mb-4">{state.seller.email}</p>
                <div className="flex justify-center mb-4">
                  <Badge variant={state.seller.verified ? "default" : "secondary"} className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {state.seller.verified ? "Verified Seller" : "Pending Verification"}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {state.seller.joinedDate}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Products</span>
                  <span className="font-semibold">{state.analytics.totalProducts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">{state.analytics.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Customers</span>
                  <span className="font-semibold">{state.analytics.totalCustomers}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Profile Information</CardTitle>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="bg-black text-white hover:bg-gray-800">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-gray-50 rounded-md">{state.seller.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-gray-50 rounded-md flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {state.seller.email}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-gray-50 rounded-md flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          {state.seller.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Business Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      {isEditing ? (
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange("businessName", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-gray-50 rounded-md">{state.seller.businessName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="businessAddress">Business Address</Label>
                      {isEditing ? (
                        <Textarea
                          id="businessAddress"
                          value={formData.businessAddress ?? ""}
                          onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-gray-50 rounded-md flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          {state.seller.businessAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-black">Password</h4>
                    <p className="text-sm text-gray-600">Last updated 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-black">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
