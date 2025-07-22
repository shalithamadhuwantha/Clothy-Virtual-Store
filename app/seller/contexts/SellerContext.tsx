"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

// Types
interface Seller {
  businessAddress: ReactNode
  id: string
  name: string
  email: string
  phone: string
  businessName: string
  isVerified: boolean
  joinDate: string
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  stock: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
  sellerId?: string
  inStock: boolean
  images?: string[]
  brand?: string
  tags?: string[]
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  status: "active" | "inactive"
}

interface CartItem extends Product {
  quantity: number
}

interface Analytics {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  lowStockProducts: number
  recentOrders: any[]
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  totalCustomers: number
}

interface FilterState {
  category: string
  priceRange: [number, number]
  inStock: boolean
  brands: string[]
  sortBy: string
}

interface SellerState {
  paymentMethods: any
  notifications: any
  customers: any
  addresses: any
  isAuthenticated: boolean
  seller: Seller | null
  products: Product[]
  recentProducts: Product[]
  analytics: Analytics
  isLoading: boolean
  allProducts: Product[]
  cart: {
    items: CartItem[]
    total: number
    itemCount: number
  }
  favorites: Product[]
  filters: FilterState
  searchQuery: string
  selectedProduct: Product | null
  isProductModalOpen: boolean
}

type SellerAction =
  | { type: "LOGIN_SELLER"; payload: Seller }
  | { type: "LOGOUT_SELLER" }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: string } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_ANALYTICS" }
  | { type: "UPDATE_RECENT_PRODUCTS" }
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_TO_FAVORITES"; payload: Product }
  | { type: "REMOVE_FROM_FAVORITES"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "UPDATE_FILTERS"; payload: Partial<FilterState> }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_SELECTED_PRODUCT"; payload: Product | null }
  | { type: "SET_PRODUCT_MODAL_OPEN"; payload: boolean }

// Mock data for seller
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 89500,
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Experience premium audio quality with advanced noise cancellation technology and exceptional comfort for all-day wear.",
    category: "T Shirt",
    brand: "AudioTech",
    stock: 25,
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    sellerId: "seller1",
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
    stock: 15,
    status: "active",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
    sellerId: "seller1",
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
    stock: 8,
    status: "active",
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
    sellerId: "seller1",
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
    stock: 30,
    status: "active",
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
    sellerId: "seller1",
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
    stock: 5,
    status: "active",
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-19T10:00:00Z",
    sellerId: "seller1",
    inStock: true,
    tags: ["watch", "minimalist", "elegant", "premium"],
  },
]

const mockOrders = [
  {
    id: "ORD001",
    items: [{ ...mockProducts[0], quantity: 1 }],
    total: 89500,
    status: "delivered",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-18",
    shippingAddress: {
      name: "Kasun Perera",
      street: "No. 45, Galle Road",
      city: "Colombo",
      state: "Western Province",
      zipCode: "00300",
      country: "Sri Lanka",
    },
  },
  {
    id: "ORD002",
    items: [{ ...mockProducts[1], quantity: 1 }],
    total: 67500,
    status: "shipped",
    orderDate: "2024-01-20",
    shippingAddress: {
      name: "Kasun Perera",
      street: "Level 12, World Trade Center",
      city: "Colombo",
      state: "Western Province",
      zipCode: "00100",
      country: "Sri Lanka",
    },
  },
  {
    id: "ORD003",
    items: [{ ...mockProducts[2], quantity: 2 }],
    total: 45000,
    status: "processing",
    orderDate: "2024-01-22",
    shippingAddress: {
      name: "Priya Silva",
      street: "No. 123, Kandy Road",
      city: "Kandy",
      state: "Central Province",
      zipCode: "20000",
      country: "Sri Lanka",
    },
  },
]

const mockCustomers: Customer[] = [
  {
    id: "customer1",
    name: "Kasun Perera",
    email: "kasun.perera@gmail.com",
    phone: "+94 77 123 4567",
    totalOrders: 2,
    totalSpent: 157000,
    lastOrderDate: "2024-01-20",
    status: "active",
  },
  {
    id: "customer2",
    name: "Priya Silva",
    email: "priya.silva@gmail.com",
    phone: "+94 71 987 6543",
    totalOrders: 1,
    totalSpent: 45000,
    lastOrderDate: "2024-01-22",
    status: "active",
  },
]

const initialState: SellerState = {
  isAuthenticated: false,
  seller: null,
  products: [],
  recentProducts: [],
  analytics: {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    recentOrders: [],
    topProducts: [],
    totalCustomers: 0,
  },
  isLoading: false,
  allProducts: [],
  cart: {
    items: [],
    total: 0,
    itemCount: 0,
  },
  favorites: [],
  filters: {
    category: "All Categories",
    priceRange: [0, 100000],
    inStock: false,
    brands: [],
    sortBy: "price-asc",
  },
  searchQuery: "",
  selectedProduct: null,
  isProductModalOpen: false,
  addresses: undefined,
  customers: undefined
}

function sellerReducer(state: SellerState, action: SellerAction): SellerState {
  switch (action.type) {
    case "LOGIN_SELLER":
      return {
        ...state,
        isAuthenticated: true,
        seller: action.payload,
        products: mockProducts,
        allProducts: mockProducts,
        recentProducts: mockProducts.slice(0, 3),
        analytics: {
          totalProducts: mockProducts.length,
          totalOrders: mockOrders.length,
          totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
          pendingOrders: mockOrders.filter((order) => order.status === "processing" || order.status === "confirmed")
            .length,
          lowStockProducts: mockProducts.filter((p) => p.stock < 10).length,
          recentOrders: mockOrders.slice(0, 5),
          topProducts: mockProducts.slice(0, 3).map((product) => ({
            id: product.id,
            name: product.name,
            sales: Math.floor(Math.random() * 30) + 10,
            revenue: product.price * (Math.floor(Math.random() * 30) + 10),
          })),
          totalCustomers: mockCustomers.length,
        },
      }

    case "LOGOUT_SELLER":
      return initialState

    case "ADD_PRODUCT": {
      const newProduct = {
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sellerId: state.seller?.id || "seller1",
      }
      const newProducts = [newProduct, ...state.products]
      const newAllProducts = [newProduct, ...state.allProducts]
      const newRecentProducts = [newProduct, ...state.recentProducts.slice(0, 4)]

      return {
        ...state,
        products: newProducts,
        allProducts: newAllProducts,
        recentProducts: newRecentProducts,
        analytics: {
          ...state.analytics,
          totalProducts: newProducts.length,
        },
      }
    }

    case "UPDATE_PRODUCT": {
      const updatedProduct = {
        ...action.payload,
        updatedAt: new Date().toISOString(),
      }
      const updatedProducts = state.products.map((product) =>
        product.id === action.payload.id ? updatedProduct : product,
      )
      const updatedAllProducts = state.allProducts.map((product) =>
        product.id === action.payload.id ? updatedProduct : product,
      )

      const updatedRecentProducts = state.recentProducts.map((product) =>
        product.id === action.payload.id ? updatedProduct : product,
      )

      return {
        ...state,
        products: updatedProducts,
        allProducts: updatedAllProducts,
        recentProducts: updatedRecentProducts,
      }
    }

    case "DELETE_PRODUCT": {
      const filteredProducts = state.products.filter((product) => product.id !== action.payload)
      const filteredAllProducts = state.allProducts.filter((product) => product.id !== action.payload)
      const filteredRecentProducts = state.recentProducts.filter((product) => product.id !== action.payload)

      return {
        ...state,
        products: filteredProducts,
        allProducts: filteredAllProducts,
        recentProducts: filteredRecentProducts,
        analytics: {
          ...state.analytics,
          totalProducts: filteredProducts.length,
        },
      }
    }

    case "ADD_TO_CART": {
      const existingItem = state.cart.items.find((item) => item.id === action.payload.id)
      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.cart.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newItems = [...state.cart.items, { ...action.payload, quantity: 1 }]
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        cart: { items: newItems, total, itemCount },
      }
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.cart.items.filter((item) => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        cart: { items: newItems, total, itemCount },
      }
    }

    case "UPDATE_QUANTITY": {
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
      if (state.favorites.some((fav) => fav.id === action.payload.id)) {
        return state
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      }
    }

    case "REMOVE_FROM_FAVORITES":
      return {
        ...state,
        favorites: state.favorites.filter((fav) => fav.id !== action.payload),
      }

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
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
          brands: [],
          sortBy: "price-asc",
        },
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

    case "UPDATE_RECENT_PRODUCTS": {
      const sortedProducts = [...state.products].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      return {
        ...state,
        recentProducts: sortedProducts.slice(0, 5),
      }
    }

    case "UPDATE_ORDER_STATUS":
      return state

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }

    case "UPDATE_ANALYTICS":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          totalProducts: state.products.length,
          lowStockProducts: state.products.filter((p) => p.stock < 10).length,
        },
      }

    default:
      return state
  }
}

const SellerContext = createContext<{
  state: SellerState
  dispatch: React.Dispatch<SellerAction>
  formatPrice: (price: number) => string
  customers: Customer[]
  orders: any[]
  getFilteredProducts: () => Product[]
} | null>(null)

export function SellerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sellerReducer, initialState)

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)

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
          product.tags?.some((tag) => tag.toLowerCase().includes(query)),
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

    // Filter by brands
    if (state.filters.brands.length > 0) {
      filtered = filtered.filter((product) => product.brand && state.filters.brands.includes(product.brand))
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
    <SellerContext.Provider
      value={{
        state,
        dispatch,
        formatPrice,
        customers: mockCustomers,
        orders: mockOrders,
        getFilteredProducts,
      }}
    >
      {children}
    </SellerContext.Provider>
  )
}

export function useSeller() {
  const context = useContext(SellerContext)
  if (!context) {
    throw new Error("useSeller must be used within a SellerProvider")
  }
  return context
}
