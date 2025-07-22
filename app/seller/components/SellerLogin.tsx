"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Store, Loader2 } from "lucide-react"
import { useSeller } from "../contexts/SellerContext"

export default function SellerLogin() {
  const { dispatch } = useSeller()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate faster API call
    setTimeout(() => {
      // Mock seller data - in real app, this would come from API
      const mockSeller = {
        id: "seller_1",
        name: "John Smith",
        email: formData.email,
        phone: "+94 77 123 4567",
        businessName: "Clothy Virtual Store",
        isVerified: true,
        joinDate: "2023-01-15",
      }

      dispatch({ type: "LOGIN_SELLER", payload: mockSeller })
      setIsLoading(false)
    }, 800) // Reduced from 1500ms to 800ms for smoother experience
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleDemoLogin = () => {
    setFormData({
      email: "seller@demo.com",
      password: "demo123",
    })
    // Auto-submit after setting demo credentials
    setTimeout(() => {
      setIsLoading(true)
      setTimeout(() => {
        const mockSeller = {
          id: "seller_1",
          name: "John Smith",
          email: "seller@demo.com",
          phone: "+94 77 123 4567",
          businessName: "Clothy Virtual Store",
          isVerified: true,
          joinDate: "2023-01-15",
        }
        dispatch({ type: "LOGIN_SELLER", payload: mockSeller })
        setIsLoading(false)
      }, 600)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-lg">
            <Store className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Seller Login</CardTitle>
          <CardDescription className="text-gray-600">
            Access your seller dashboard to manage your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seller@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-11"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="h-11 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-black text-white hover:bg-gray-800 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <Button
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Demo...
              </>
            ) : (
              "Try Demo Account"
            )}
          </Button>

          <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Email: seller@demo.com</p>
            <p>Password: any password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
