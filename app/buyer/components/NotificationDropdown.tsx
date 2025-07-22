"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Check, Eye, Package, Truck, Star, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "../contexts/AppContext"

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { state, dispatch } = useApp()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = state.notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = (id: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: id })
  }

  const clearAll = () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" })
  }

  const handleNotificationAction = (notification: any) => {
    markAsRead(notification.id)

    if (notification.actionType === "view_order" && notification.orderId) {
      const order = state.orders.find((o) => o.id === notification.orderId)
      if (order) {
        dispatch({ type: "SET_SELECTED_ORDER", payload: order })
        dispatch({ type: "SET_ORDER_DETAILS_MODAL_OPEN", payload: true })
        setIsOpen(false)
      }
    } else if (notification.actionType === "track_order" && notification.orderId) {
      const order = state.orders.find((o) => o.id === notification.orderId)
      if (order) {
        dispatch({ type: "SET_SELECTED_ORDER", payload: order })
        dispatch({ type: "SET_ORDER_DETAILS_MODAL_OPEN", payload: true })
        setIsOpen(false)
        // In a real app, this would scroll to tracking section
      }
    } else if (notification.actionType === "rate_product") {
      // In a real app, this would open a rating modal
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: Date.now().toString(),
          title: "Thank you for your feedback! ⭐",
          message: "Your rating helps other customers make better decisions.",
          type: "success",
          read: false,
          createdAt: new Date().toLocaleString(),
        },
      })
    } else if (notification.actionType === "reorder") {
      const order = state.orders.find((o) => o.id === notification.orderId)
      if (order) {
        order.items.forEach((item) => {
          dispatch({ type: "ADD_TO_CART", payload: item })
        })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: Date.now().toString(),
            title: "Items Added to Cart! 🛒",
            message: `${order.items.length} items from order #${order.id} have been added to your cart.`,
            type: "success",
            read: false,
            createdAt: new Date().toLocaleString(),
          },
        })
        setIsOpen(false)
      }
    }
  }

  const getNotificationIcon = (type: string, actionType?: string) => {
    if (actionType === "view_order" || actionType === "track_order") return <Package className="h-5 w-5" />
    if (actionType === "rate_product") return <Star className="h-5 w-5" />
    if (actionType === "reorder") return <ShoppingCart className="h-5 w-5" />

    switch (type) {
      case "success":
        return <div className="text-green-600">✅</div>
      case "warning":
        return <div className="text-yellow-600">⚠️</div>
      case "error":
        return <div className="text-red-600">❌</div>
      default:
        return <div className="text-blue-600">ℹ️</div>
    }
  }

  const getActionButtonText = (actionType?: string) => {
    switch (actionType) {
      case "view_order":
        return "View Details"
      case "track_order":
        return "Track Order"
      case "rate_product":
        return "Rate Product"
      case "reorder":
        return "Reorder"
      default:
        return "View"
    }
  }

  const getActionButtonIcon = (actionType?: string) => {
    switch (actionType) {
      case "view_order":
        return <Eye className="h-3 w-3" />
      case "track_order":
        return <Truck className="h-3 w-3" />
      case "rate_product":
        return <Star className="h-3 w-3" />
      case "reorder":
        return <ShoppingCart className="h-3 w-3" />
      default:
        return <Eye className="h-3 w-3" />
    }
  }

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-gray-100 rounded-xl transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-black" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-50 max-h-[80vh] sm:max-h-96">
          <div className="p-4 border-b-2 border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-black">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                    {unreadCount} new
                  </span>
                )}
                {state.notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-gray-500 hover:text-black rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {state.notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-gray-600 font-medium">No notifications yet</p>
                <p className="text-gray-500 text-sm">We'll notify you about orders and updates</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {state.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.actionType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-black text-xs sm:text-sm leading-tight">
                          {notification.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2 font-medium">{notification.createdAt}</p>

                        {notification.actionType && (
                          <div className="mt-3 flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleNotificationAction(notification)}
                              className="bg-black text-white hover:bg-gray-800 rounded-lg text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5"
                            >
                              {getActionButtonIcon(notification.actionType)}
                              <span className="ml-1">{getActionButtonText(notification.actionType)}</span>
                            </Button>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-gray-500 hover:text-black rounded-lg text-xs px-2 py-1.5"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {state.notifications.length > 0 && (
            <div className="p-3 sm:p-4 border-t-2 border-gray-200 bg-gray-50 rounded-b-2xl">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-2 border-gray-200 hover:border-black rounded-xl font-semibold"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
