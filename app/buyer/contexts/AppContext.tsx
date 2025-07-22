"use client"

import type React from "react"
import { createContext, useContext, useReducer } from "react"
import type { ReactNode } from "react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  brand?: string
  inStock: boolean
  tags: string[]
}

interface CartItem extends Product {
  originalPrice: number
  quantity: number
}

interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
  type: "home" | "work" | "other"
}

interface PaymentMethod {
  expiryDate: ReactNode
  id: string
  type: "card" | "bank"
  cardNumber?: string
  cardholderName?: string
  bankName?: string
  accountNumber?: string
  isDefault: boolean
}

interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  deliveryDate?: string
  shippingAddress: Address
  paymentMethod: PaymentMethod
  trackingNumber?: string
  estimatedDelivery?: string
  orderNotes?: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  orderId?: string
  actionType?: "view_order" | "track_order" | "rate_product" | "reorder"
  actionData?: any
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
}

interface FilterState {
  category: string
  priceRange: [number, number]
  inStock: boolean
  sortBy: string
}

interface AppState {
  isAuthenticated: boolean
  user: User | null
  cart: {
    items: CartItem[]
    total: number
    itemCount: number
  }
  favorites: Product[]
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  orders: Order[]
  notifications: Notification[]
  searchQuery: string
  searchResults: Product[]
  selectedProduct: Product | null
  isProductModalOpen: boolean
  selectedOrder: Order | null
  isOrderDetailsModalOpen: boolean
  filters: FilterState
  allProducts: Product[]
}

type AppAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "REGISTER"; payload: User }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_TO_FAVORITES"; payload: Product }
  | { type: "REMOVE_FROM_FAVORITES"; payload: string }
  | { type: "ADD_ADDRESS"; payload: Address }
  | { type: "UPDATE_ADDRESS"; payload: Address }
  | { type: "DELETE_ADDRESS"; payload: string }
  | { type: "SET_DEFAULT_ADDRESS"; payload: string }
  | { type: "ADD_PAYMENT_METHOD"; payload: PaymentMethod }
  | { type: "UPDATE_PAYMENT_METHOD"; payload: PaymentMethod }
  | { type: "DELETE_PAYMENT_METHOD"; payload: string }
  | { type: "SET_DEFAULT_PAYMENT_METHOD"; payload: string }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: Order }
  | { type: "DELETE_ORDER"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SEARCH_RESULTS"; payload: Product[] }
  | { type: "SET_SELECTED_PRODUCT"; payload: Product | null }
  | { type: "SET_PRODUCT_MODAL_OPEN"; payload: boolean }
  | { type: "SET_SELECTED_ORDER"; payload: Order | null }
  | { type: "SET_ORDER_DETAILS_MODAL_OPEN"; payload: boolean }
  | { type: "UPDATE_FILTERS"; payload: Partial<FilterState> }
  | { type: "CLEAR_FILTERS" }

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  formatPrice: (price: number) => string
  getFilteredProducts: () => Product[]
} | null>(null)

const allProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 89500,
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Experience premium audio quality with advanced noise cancellation technology and exceptional comfort for all-day wear.",
    category: "T Shirt",
    brand: "AudioTech",
    inStock: true,
    tags: ["wireless", "noise-cancelling", "premium", "bluetooth"],
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 67500,
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and 7-day battery life.",
    category: "T Shirt",
    brand: "FitTech",
    inStock: true,
    tags: ["smartwatch", "fitness", "gps", "health"],
  },
  {
    id: "3",
    name: "Leather Laptop Bag",
    price: 22500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Handcrafted genuine leather laptop bag with multiple compartments and premium finishing.",
    category: "Pants",
    brand: "LeatherCraft",
    inStock: true,
    tags: ["leather", "laptop", "professional", "handcrafted"],
  },
  {
    id: "4",
    name: "Wireless Charging Pad",
    price: 8500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicators.",
    category: "T Shirt",
    brand: "ChargeTech",
    inStock: true,
    tags: ["wireless", "charging", "qi", "fast-charge"],
  },
  {
    id: "5",
    name: "Minimalist Watch",
    price: 59500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Elegant minimalist watch with premium materials and timeless design.",
    category: "Dress",
    brand: "TimeClassic",
    inStock: true,
    tags: ["watch", "minimalist", "elegant", "premium"],
  },
  {
    id: "6",
    name: "Premium Coffee Mug",
    price: 8500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Insulated coffee mug with elegant design and temperature retention.",
    category: "Home",
    brand: "HomeEssentials",
    inStock: true,
    tags: ["coffee", "insulated", "premium", "temperature"],
  },
  {
    id: "7",
    name: "Bluetooth Speaker",
    price: 45000,
    image: "/placeholder.svg?height=400&width=400",
    description: "Portable Bluetooth speaker with rich sound quality and long battery life.",
    category: "T Shirt",
    brand: "SoundWave",
    inStock: false,
    tags: ["bluetooth", "speaker", "portable", "wireless"],
  },
  {
    id: "8",
    name: "Canvas Backpack",
    price: 18500,
    image: "/placeholder.svg?height=400&width=400",
    description: "Durable canvas backpack perfect for daily use and outdoor adventures.",
    category: "Pants",
    brand: "OutdoorGear",
    inStock: true,
    tags: ["canvas", "backpack", "durable", "outdoor"],
  },
]

const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  cart: {
    items: [],
    total: 0,
    itemCount: 0,
  },
  favorites: [],
  addresses: [],
  paymentMethods: [],
  orders: [],
  notifications: [],
  searchQuery: "",
  searchResults: [],
  selectedProduct: null,
  isProductModalOpen: false,
  selectedOrder: null,
  isOrderDetailsModalOpen: false,
  filters: {
    category: "All Categories",
    priceRange: [0, 100000],
    inStock: false,
    sortBy: "price-asc",
  },
  allProducts,
}

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        // Load user-specific data when logging in
        addresses: [
          {
            id: "1",
            name: "Home",
            street: "No. 45, Galle Road",
            city: "Colombo",
            state: "Western Province",
            zipCode: "00300",
            country: "Sri Lanka",
            isDefault: true,
            type: "home",
          },
        ],
        paymentMethods: [
          {
            id: "1",
            type: "card",
            cardNumber: "4532123456789012",
            cardholderName: action.payload.name,
            isDefault: true,
          },
        ],
        orders: [
          {
            id: "ORD001",
            items: [
              {
                id: "1",
                name: "Premium Wireless Headphones",
                price: 89500,
                image: "/placeholder.svg?height=400&width=400",
                description: "High-quality wireless headphones with active noise cancellation",
                category: "T Shirt",
                brand: "AudioTech",
                inStock: true,
                tags: ["wireless", "noise-cancelling", "premium", "bluetooth"],
                quantity: 1,
                originalPrice: 0,
              },
            ],
            total: 89500,
            status: "delivered",
            orderDate: "2024-01-15",
            deliveryDate: "2024-01-18",
            trackingNumber: "TRK123456789LK",
            estimatedDelivery: "2-3 business days",
            orderNotes: "Delivered to security guard at main gate",
            shippingAddress: {
              id: "1",
              name: "Home",
              street: "No. 45, Galle Road",
              city: "Colombo",
              state: "Western Province",
              zipCode: "00300",
              country: "Sri Lanka",
              isDefault: true,
              type: "home",
            },
            paymentMethod: {
              id: "1",
              type: "card",
              cardNumber: "4532123456789012",
              cardholderName: action.payload.name,
              isDefault: true,
            },
          },
        ],
      }

    case "REGISTER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      }

    case "LOGOUT":
      return {
        ...initialState,
        allProducts: state.allProducts,
        // Keep search state for better UX
        searchQuery: state.searchQuery,
        searchResults: state.searchResults,
        filters: state.filters,
      }

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      }

    case "ADD_TO_CART": {
      if (!state.isAuthenticated) return state

      const existingItem = state.cart.items.find((item) => item.id === action.payload.id)
      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.cart.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newItems = [...state.cart.items, { ...action.payload, quantity: 1, originalPrice: action.payload.price }]
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        cart: { items: newItems, total, itemCount },
      }
    }

    case "REMOVE_FROM_CART": {
      if (!state.isAuthenticated) return state

      const newItems = state.cart.items.filter((item) => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        cart: { items: newItems, total, itemCount },
      }
    }

    case "UPDATE_QUANTITY": {
      if (!state.isAuthenticated) return state

      const newItems = state.cart.items
        .map((item) =>
          item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item,
        )
        .filter((item) => item.quantity > 0)

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        cart: { items: newItems, total, itemCount },
      }
    }

    case "CLEAR_CART":
      return {
        ...state,
        cart: { items: [], total: 0, itemCount: 0 },
      }

    case "ADD_TO_FAVORITES": {
      if (!state.isAuthenticated) return state

      if (state.favorites.some((fav) => fav.id === action.payload.id)) {
        return state
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      }
    }

    case "REMOVE_FROM_FAVORITES":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        favorites: state.favorites.filter((fav) => fav.id !== action.payload),
      }

    case "ADD_ADDRESS":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
      }

    case "UPDATE_ADDRESS":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        addresses: state.addresses.map((addr) => (addr.id === action.payload.id ? action.payload : addr)),
      }

    case "DELETE_ADDRESS":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        addresses: state.addresses.filter((addr) => addr.id !== action.payload),
      }

    case "SET_DEFAULT_ADDRESS":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        addresses: state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === action.payload,
        })),
      }

    case "ADD_PAYMENT_METHOD":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        paymentMethods: [...state.paymentMethods, action.payload],
      }

    case "UPDATE_PAYMENT_METHOD":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        paymentMethods: state.paymentMethods.map((pm) => (pm.id === action.payload.id ? action.payload : pm)),
      }

    case "DELETE_PAYMENT_METHOD":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        paymentMethods: state.paymentMethods.filter((pm) => pm.id !== action.payload),
      }

    case "SET_DEFAULT_PAYMENT_METHOD":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        paymentMethods: state.paymentMethods.map((pm) => ({
          ...pm,
          isDefault: pm.id === action.payload,
        })),
      }

    case "ADD_ORDER":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      }

    case "UPDATE_ORDER":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        orders: state.orders.map((order) => (order.id === action.payload.id ? action.payload : order)),
      }

    case "DELETE_ORDER":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.payload),
      }

    case "ADD_NOTIFICATION":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      }

    case "MARK_NOTIFICATION_READ":
      if (!state.isAuthenticated) return state
      return {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload ? { ...notif, read: true } : notif,
        ),
      }

    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
      }

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      }

    case "SET_SEARCH_RESULTS":
      return {
        ...state,
        searchResults: action.payload,
      }

    case "SET_SELECTED_PRODUCT":
      return {
        ...state,
        selectedProduct: action.payload,
      }

    case "SET_PRODUCT_MODAL_OPEN":
      return {
        ...state,
        isProductModalOpen: action.payload,
      }

    case "SET_SELECTED_ORDER":
      return {
        ...state,
        selectedOrder: action.payload,
      }

    case "SET_ORDER_DETAILS_MODAL_OPEN":
      return {
        ...state,
        isOrderDetailsModalOpen: action.payload,
      }

    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }

    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {
          category: "All Categories",
          priceRange: [0, 100000],
          inStock: false,
          sortBy: "price-asc",
        },
      }

    default:
      return state
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getFilteredProducts = (): Product[] => {
    let filtered = [...state.allProducts]

    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Filter by category
    if (state.filters.category !== "All Categories") {
      filtered = filtered.filter((product) => product.category === state.filters.category)
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) => product.price >= state.filters.priceRange[0] && product.price <= state.filters.priceRange[1],
    )

    // Filter by stock status
    if (state.filters.inStock) {
      filtered = filtered.filter((product) => product.inStock)
    }

    // Sort products
    switch (state.filters.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      default:
        filtered.sort((a, b) => a.price - b.price)
        break
    }

    return filtered
  }

  return (
    <AppContext.Provider value={{ state, dispatch, formatPrice, getFilteredProducts }}>{children}</AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
