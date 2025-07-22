"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  User,
  Package,
  Heart,
  Settings,
  CreditCard,
  MapPin,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Globe,
  Shield,
  Eye,
  Truck,
  Filter,
  RotateCcw,
  EyeOff,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useApp } from "../contexts/AppContext"
import Image from "next/image"
import AddressForm from "../components/AddressForm"
import PaymentMethodForm from "../components/PaymentMethodForm"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [showEditAddressModal, setShowEditAddressModal] = useState(false)
  const [editingAddressData, setEditingAddressData] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const { state, dispatch } = useApp()
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false)
  const [editingPaymentData, setEditingPaymentData] = useState<any>(null)
  const [orderFilter, setOrderFilter] = useState("all")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const router = useRouter()
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    if (!state.isAuthenticated || !state.user) {
      router.push("/buyer")
      return
    }

    setProfileForm({
      firstName: state.user.name.split(" ")[0] || "",
      lastName: state.user.name.split(" ")[1] || "",
      email: state.user.email || "",
      phone: state.user.phone || "",
    })

    setIsLoading(false)
  }, [state.isAuthenticated, state.user, router])

  if (isLoading || !state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleProfileUpdate = () => {
    if (!state.user) return

    const updatedUser = {
      ...state.user,
      name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
      email: profileForm.email,
      phone: profileForm.phone,
    }
    dispatch({ type: "UPDATE_USER", payload: updatedUser })
    toast.success("Profile updated successfully!")
  }

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }

    // In a real app, you would validate the current password against the server
    if (passwordForm.currentPassword !== "password123") {
      // Mock validation
      toast.error("Current password is incorrect")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long")
      return
    }

    // In a real app, you would send this to your backend
    dispatch({
      type: "UPDATE_USER",
      payload: {
        ...state.user,
        // Password would be handled securely on the backend
      },
    })

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setShowChangePassword(false)
    toast.success("Password changed successfully!")
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        dispatch({
          type: "UPDATE_USER",
          payload: {
            ...state.user,
            profileImage: imageUrl,
          },
        })
        toast.success("Profile photo updated successfully!")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteAccount = () => {
    // Clear all user data
    dispatch({ type: "LOGOUT" })
    dispatch({ type: "CLEAR_ALL_DATA" })
    toast.success("Account deleted successfully!")
    router.push("/buyer")
  }

  const handleSignOut = () => {
    dispatch({ type: "LOGOUT" })
    toast.success("Signed out successfully!")
    router.push("/buyer")
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "confirmed":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "confirmed":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const recentOrders = state.orders.slice(0, 3)
  const favoriteItems = state.favorites.slice(0, 4)

  const quickActions = [
    {
      title: "View Orders",
      description: "Track your recent purchases",
      icon: Package,
      action: () => setActiveTab("orders"),
      count: state.orders.length,
    },
    {
      title: "Wishlist",
      description: "Items you've saved",
      icon: Heart,
      action: () => setActiveTab("wishlist"),
      count: state.favorites.length,
    },
    {
      title: "Addresses",
      description: "Manage delivery addresses",
      icon: MapPin,
      action: () => setActiveTab("addresses"),
      count: state.addresses.length,
    },
    {
      title: "Payment Methods",
      description: "Manage payment options",
      icon: CreditCard,
      action: () => setActiveTab("payment"),
      count: state.paymentMethods.length,
    },
  ]

  const renderProfile = () => (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {state.user?.profileImage ? (
                  <Image
                    src={state.user.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-gray-600" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{state.user?.name}</h3>
              <p className="text-gray-500">{state.user?.email}</p>
              <label htmlFor="photo-upload">
                <Button variant="outline" size="sm" className="mt-2 bg-transparent cursor-pointer" asChild>
                  <span>Change Photo</span>
                </Button>
              </label>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="+94 77 123 4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleProfileUpdate} className="bg-black text-white hover:bg-gray-800">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <p className="text-gray-500">Track and manage your orders</p>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                {["all", "processing", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setOrderFilter(status)
                      setShowFilterDropdown(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      orderFilter === status ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {state.orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Button onClick={() => router.push("/buyer/products")}>Browse Products</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {state.orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getOrderStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">Placed on {order.orderDate}</p>
                      {order.trackingNumber && (
                        <p className="text-xs text-gray-400">Tracking: {order.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="font-semibold text-gray-900">{order.items.length} items</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery</p>
                    <p className="font-semibold text-gray-900">{order.deliveryDate || "Pending"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      dispatch({ type: "SET_SELECTED_ORDER", payload: order })
                      dispatch({ type: "SET_ORDER_DETAILS_MODAL_OPEN", payload: true })
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {order.trackingNumber && (
                    <Button variant="outline" size="sm" disabled>
                      <Truck className="h-4 w-4 mr-2" />
                      Track Order
                    </Button>
                  )}
                  {order.status === "delivered" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        order.items.forEach((item) => {
                          dispatch({ type: "ADD_TO_CART", payload: item })
                        })
                        toast.success("Items added to cart!")
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderWishlist = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
        <p className="text-gray-500">{state.favorites.length} items saved</p>
      </div>

      {state.favorites.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save items you love for later</p>
            <Button onClick={() => router.push("/buyer/products")}>Browse Products</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.favorites.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-xl font-bold text-gray-900 mb-4">{formatPrice(item.price)}</p>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => dispatch({ type: "ADD_TO_CART", payload: item })}
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                    size="sm"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => dispatch({ type: "REMOVE_FROM_FAVORITES", payload: item.id })}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Addresses</h2>
          <p className="text-gray-500">Manage your delivery addresses</p>
        </div>
        <Button onClick={() => setShowAddAddress(true)} className="bg-black text-white hover:bg-gray-800">
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {showAddAddress && (
        <AddressForm onSave={() => setShowAddAddress(false)} onCancel={() => setShowAddAddress(false)} />
      )}

      {state.addresses.length === 0 && !showAddAddress ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-500 mb-6">Add an address for faster checkout</p>
            <Button onClick={() => setShowAddAddress(true)}>Add Address</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "ring-2 ring-black" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{address.name}</h3>
                      {address.isDefault && <Badge>Default</Badge>}
                    </div>
                    <div className="text-gray-600 space-y-1">
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingAddressData(address)
                        setShowEditAddressModal(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {!address.isDefault && (
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Address Modal */}
      <Dialog open={showEditAddressModal} onOpenChange={setShowEditAddressModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {editingAddressData && (
              <AddressForm
                initialData={editingAddressData}
                onSave={(updatedAddress) => {
                  dispatch({
                    type: "UPDATE_ADDRESS",
                    payload: { id: editingAddressData.id, ...updatedAddress },
                  })
                  setShowEditAddressModal(false)
                  setEditingAddressData(null)
                  toast.success("Address updated successfully!")
                }}
                onCancel={() => {
                  setShowEditAddressModal(false)
                  setEditingAddressData(null)
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
          <p className="text-gray-500">Manage your payment options</p>
        </div>
        <Button onClick={() => setShowAddPayment(true)} className="bg-black text-white hover:bg-gray-800">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {showAddPayment && (
        <PaymentMethodForm onSave={() => setShowAddPayment(false)} onCancel={() => setShowAddPayment(false)} />
      )}

      {state.paymentMethods.length === 0 && !showAddPayment ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods saved</h3>
            <p className="text-gray-500 mb-6">Add a payment method for faster checkout</p>
            <Button onClick={() => setShowAddPayment(true)}>Add Payment Method</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.paymentMethods.map((paymentMethod) => (
            <Card key={paymentMethod.id} className={paymentMethod.isDefault ? "ring-2 ring-black" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {paymentMethod.type === "card" ? "Credit Card" : "Bank Transfer"}
                      </h3>
                      {paymentMethod.isDefault && <Badge>Default</Badge>}
                    </div>
                    <div className="text-gray-600 space-y-1">
                      {paymentMethod.type === "card" ? (
                        <div>
                          <p>**** **** **** {paymentMethod.cardNumber?.slice(-4)}</p>
                          <p>Expires {paymentMethod.expiryDate}</p>
                        </div>
                      ) : (
                        <div>
                          <p>{paymentMethod.bankName}</p>
                          <p>****{paymentMethod.accountNumber?.slice(-4)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingPaymentData(paymentMethod)
                        setShowEditPaymentModal(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {!paymentMethod.isDefault && (
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Payment Method Modal */}
      <Dialog open={showEditPaymentModal} onOpenChange={setShowEditPaymentModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {editingPaymentData && (
              <PaymentMethodForm
                initialData={editingPaymentData}
                onSave={(updatedPayment) => {
                  dispatch({
                    type: "UPDATE_PAYMENT_METHOD",
                    payload: { id: editingPaymentData.id, ...updatedPayment },
                  })
                  setShowEditPaymentModal(false)
                  setEditingPaymentData(null)
                  toast.success("Payment method updated successfully!")
                }}
                onCancel={() => {
                  setShowEditPaymentModal(false)
                  setEditingPaymentData(null)
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderSettings = () => (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="text-gray-500">Manage your account preferences and security</p>
      </div>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Language & Region</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
              <option>English</option>
              {/* <option>Sinhala (සිංහල)</option>
              <option>Tamil (தமிழ்)</option> */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
              <option>LKR (Rs.)</option>
              {/* <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option> */}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Shield className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleChangePassword} className="flex-1 bg-black text-white hover:bg-gray-800">
                    Change Password
                  </Button>
                  <Button
                    onClick={() => {
                      setShowChangePassword(false)
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      })
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* <Button variant="outline" className="w-full justify-start bg-transparent">
            <User className="h-4 w-4 mr-2" />
            Download My Data
          </Button> */}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from
                  our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 text-white hover:bg-red-700">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardContent className="p-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                <AlertDialogDescription>You will be redirected to the home page.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSignOut} className="bg-black text-white hover:bg-gray-800">
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfile()
      case "orders":
        return renderOrders()
      case "wishlist":
        return renderWishlist()
      case "addresses":
        return renderAddresses()
      case "payment":
        return renderPayment()
      case "settings":
        return renderSettings()
      default:
        return renderProfile()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{state.user?.name}</h3>
                    <p className="text-sm text-gray-500">{state.user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === tab.id
                        ? "bg-black text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
