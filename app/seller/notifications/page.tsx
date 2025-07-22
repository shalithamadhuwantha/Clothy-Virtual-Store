"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, CheckCheck, Trash2, Package, ShoppingCart, AlertCircle, Info } from "lucide-react"
import { useSeller } from "../contexts/SellerContext"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

export default function SellerNotifications() {
  const { state, dispatch } = useSeller()

  const markAsRead = (id: string) => {
    console.log("Marking notification as read:", id)
  }

  const clearAllNotifications = () => {
    console.log("Clearing all notifications")
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCheck className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const unreadCount = state.notifications.filter((n: { read: any }) => !n.read).length

  if (state.notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Bell className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-4">No Notifications</h1>
            <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-4">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All notifications read"}
            </p>
          </div>
          {state.notifications.length > 0 && (
            <Button
              onClick={clearAllNotifications}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {state.notifications.map((notification: { id: Key | null | undefined; read: any; type: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; createdAt: string | number | Date; actionType: string }) => (
            <Card key={notification.id} className={`${!notification.read ? "ring-2 ring-blue-200 bg-blue-50/30" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{getNotificationIcon(typeof notification.type === "string" ? notification.type : "info")}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-black">{notification.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getNotificationBadgeColor(typeof notification.type === "string" ? notification.type : "info")}>
                          {typeof notification.type === "string" ? notification.type : "info"}
                        </Badge>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (typeof notification.id === "string") {
                                markAsRead(notification.id)
                              }
                            }}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </span>
                      {notification.actionType && (
                        <Button size="sm" variant="outline">
                          {notification.actionType === "view_order" && "View Order"}
                          {notification.actionType === "track_order" && "Track Order"}
                          {notification.actionType === "rate_product" && "Rate Product"}
                          {notification.actionType === "reorder" && "Reorder"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sample notifications for demo */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-black">Sample Notifications</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-2">New Order Received</h3>
                    <p className="text-gray-600 mb-3">You have received a new order for Premium Wireless Headphones</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">2 hours ago</span>
                      <Button size="sm" variant="outline">
                        View Order
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-2">Product Added to Cart</h3>
                    <p className="text-gray-600 mb-3">Smart Fitness Watch has been added to your cart</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">1 day ago</span>
                      <Button size="sm" variant="outline">
                        View Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
