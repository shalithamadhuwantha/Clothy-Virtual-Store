"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Search, Mail, Phone, ShoppingBag, DollarSign, Eye } from "lucide-react"
import { useSeller } from "../contexts/SellerContext"

export default function SellerCustomers() {
  const { state, formatPrice } = useSeller()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const filteredCustomers = state.customers.filter(
    (customer: { name: string; email: string }) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Customer Management</h1>
          <p className="text-gray-600">View and manage your customers</p>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-black">{state.customers.length}</div>
                <div className="text-sm text-gray-600">Total Customers</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Customer Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Customers</p>
                  <p className="text-2xl font-bold text-black">
                    {state.customers.filter((c: { status: string }) => c.status === "active").length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-black">
                    {state.customers.reduce((sum: any, customer: { totalOrders: any }) => sum + customer.totalOrders, 0)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-black">
                    {formatPrice(state.customers.reduce((sum: any, customer: { totalSpent: any }) => sum + customer.totalSpent, 0))}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No customers found</h3>
                <p className="text-gray-600">
                  {searchQuery ? "Try adjusting your search terms" : "No customers have placed orders yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCustomers.map((customer: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; phone: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; totalOrders: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; totalSpent: number; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{customer.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Orders</div>
                        <div className="font-semibold text-black">{customer.totalOrders}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Spent</div>
                        <div className="font-semibold text-black">{formatPrice(customer.totalSpent)}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                          {customer.status}
                        </Badge>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleViewCustomer(customer)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Customer Details</DialogTitle>
                          </DialogHeader>
                          {selectedCustomer && (
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                  <Users className="h-8 w-8 text-gray-600" />
                                </div>
                                <div>
                                  <h2 className="text-xl font-semibold text-black">{selectedCustomer.name}</h2>
                                  <p className="text-gray-600">{selectedCustomer.email}</p>
                                  <p className="text-gray-600">{selectedCustomer.phone}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-black">{selectedCustomer.totalOrders}</div>
                                    <div className="text-sm text-gray-600">Total Orders</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-black">
                                      {formatPrice(selectedCustomer.totalSpent)}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Spent</div>
                                  </CardContent>
                                </Card>
                              </div>

                              <div className="space-y-3">
                                <h3 className="font-semibold text-black">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Status:</span>
                                    <Badge
                                      className="ml-2"
                                      variant={selectedCustomer.status === "active" ? "default" : "secondary"}
                                    >
                                      {selectedCustomer.status}
                                    </Badge>
                                  </div>
                                  {selectedCustomer.lastOrderDate && (
                                    <div>
                                      <span className="text-gray-600">Last Order:</span>
                                      <span className="ml-2 text-black">{selectedCustomer.lastOrderDate}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
