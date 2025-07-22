"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, DollarSign, Users, Clock, TrendingUp } from "lucide-react"
import { useSeller } from "../contexts/SellerContext"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import React from 'react'

export default function SellerDashboard() {
  const { state, dispatch, formatPrice } = useSeller()
  const router = useRouter()

  // Safely access analytics with fallbacks
  const analytics = state.analytics ?? {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  }

  // Get recent products from state
  const recentProducts = state.recentProducts ?? []

  useEffect(() => {
    // Update analytics and recent products when component mounts
    dispatch({ type: "UPDATE_ANALYTICS" })
    dispatch({ type: "UPDATE_RECENT_PRODUCTS" })
  }, [dispatch])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        router.replace('/seller/register')
      }
    }
  }, [router])

  const stats = [
    {
      title: "Total Products",
      value: analytics.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders,
      icon: ShoppingCart,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Total Revenue",
      value: formatPrice(analytics.totalRevenue),
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Customers",
      value: analytics.totalCustomers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} flex-shrink-0`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle>Recent Products</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {recentProducts.length}
            </Badge>
          </div>
          <Link href="/seller/products">
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentProducts.length > 0 ? (
            <div className="space-y-4">
              {recentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={product.image || product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 py-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{product.category}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(product.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                    <Badge variant={product.inStock ? "default" : "secondary"} className="mt-1">
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No products yet. Add your first product to get started!</p>
              <p className="text-sm text-gray-400 mb-4">Your recently added products will appear here</p>
              <Link href="/seller/products">
                <Button className="mt-4">
                  <Package className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
