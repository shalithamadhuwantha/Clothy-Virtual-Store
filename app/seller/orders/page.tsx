"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package, Search, Eye, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { useSeller } from "../contexts/SellerContext"

export default function SellerOrders() {
  const { orders: userOrders, dispatch, formatPrice } = useSeller()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Sample orders for demo
  const sampleOrders = [
    {
      id: "ORD-001",
      items: [
        {
          id: "1",
          name: "Premium Wireless Headphones",
          price: 89500,
          quantity: 1,
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
      total: 89500,
      status: "processing",
      orderDate: "2024-01-20",
      deliveryDate: "2024-01-25",
      shippingAddress: {
        name: "John Doe",
        street: "123 Main St",
        city: "Colombo",
        state: "Western",
        zipCode: "10100",
        country: "Sri Lanka",
      },
      paymentMethod: {
        type: "card",
        cardNumber: "****1234",
      },
      trackingNumber: "TRK123456789",
      customerName: "John Doe",
      customerEmail: "john@example.com",
    },
    {
      id: "ORD-002",
      items: [
        {
          id: "2",
          name: "Smart Fitness Watch",
          price: 67500,
          quantity: 2,
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
      total: 135000,
      status: "shipped",
      orderDate: "2024-01-18",
      deliveryDate: "2024-01-23",
      shippingAddress: {
        name: "Jane Smith",
        street: "456 Oak Ave",
        city: "Kandy",
        state: "Central",
        zipCode: "20000",
        country: "Sri Lanka",
      },
      paymentMethod: {
        type: "bank",
        bankName: "Bank of Ceylon",
      },
      trackingNumber: "TRK987654321",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
    },
  ]

  const allOrders = [...userOrders, ...sampleOrders]

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const order = allOrders.find((o) => o.id === orderId)
    if (order) {
      const updatedOrder = { ...order, status: newStatus }
      dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId, status: newStatus } })
    }
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Order Management</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search orders by ID, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
              />
            </div>
          </div>
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-black">{filteredOrders.length}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {["processing", "confirmed", "shipped", "delivered", "cancelled"].map((status) => {
            const count = allOrders.filter((order) => order.status === status).length
            return (
              <Card key={status}>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">{getStatusIcon(status)}</div>
                  <div className="text-xl font-bold text-black">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">{status}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter"
                    : "No orders have been placed yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-semibold text-black text-lg">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold text-black">{formatPrice(order.total)}</div>
                          <div className="text-sm text-gray-600">{order.orderDate}</div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleViewOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details - {selectedOrder?.id || order.id}</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Order Status */}
                                <div className="flex items-center justify-between">
                                  <Badge className={getStatusColor(selectedOrder.status)}>
                                    {getStatusIcon(selectedOrder.status)}
                                    <span className="ml-2 capitalize">{selectedOrder.status}</span>
                                  </Badge>
                                  <Select
                                    value={selectedOrder.status}
                                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                                  >
                                    <SelectTrigger className="w-48">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Customer Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Customer Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <p>
                                        <strong>Name:</strong> {selectedOrder.customerName}
                                      </p>
                                      <p>
                                        <strong>Email:</strong> {selectedOrder.customerEmail}
                                      </p>
                                      <p>
                                        <strong>Order Date:</strong> {selectedOrder.orderDate}
                                      </p>
                                      {selectedOrder.trackingNumber && (
                                        <p>
                                          <strong>Tracking:</strong> {selectedOrder.trackingNumber}
                                        </p>
                                      )}
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Shipping Address</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-gray-700">
                                        <p>{selectedOrder.shippingAddress.name}</p>
                                        <p>{selectedOrder.shippingAddress.street}</p>
                                        <p>
                                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                                        </p>
                                        <p>{selectedOrder.shippingAddress.zipCode}</p>
                                        <p>{selectedOrder.shippingAddress.country}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Order Items */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Order Items</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedOrder.items.map((item: any) => (
                                        <div
                                          key={item.id}
                                          className="flex items-center space-x-4 p-4 border rounded-lg"
                                        >
                                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                              src={item.image || "/placeholder.svg"}
                                              alt={item.name}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-medium text-black">{item.name}</h4>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-semibold text-black">
                                              {formatPrice(item.price * item.quantity)}
                                            </p>
                                            <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="border-t pt-4 mt-4">
                                      <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>{formatPrice(selectedOrder.total)}</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Customer:</span>
                        <span className="ml-2 text-black">{order.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Items:</span>
                        <span className="ml-2 text-black">{order.items.length} item(s)</span>
                      </div>
                      {order.trackingNumber && (
                        <div>
                          <span className="text-gray-600">Tracking:</span>
                          <span className="ml-2 text-black font-mono">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
