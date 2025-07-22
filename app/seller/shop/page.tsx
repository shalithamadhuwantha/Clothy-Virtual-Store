"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Filter, ChevronDown, X, Search, Package, DollarSign, ShoppingCart, Heart, Eye, Star } from "lucide-react"
import { useSeller } from "../contexts/SellerContext"

const categories = ["All Categories", "T Shirt", "Dress", "Pants", "Home"]
const sortOptions = [
  { label: "Low Price", value: "price-asc" },
  { label: "High Price", value: "price-desc" },
]

export default function SellerShop() {
  const { state, dispatch, formatPrice, getFilteredProducts } = useSeller()
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => getFilteredProducts(), [state.filters, state.searchQuery, state.allProducts])

  const availableBrands = useMemo(() => {
    const brands = [...new Set(state.allProducts.map((product) => product.brand).filter(Boolean))]
    return brands.sort()
  }, [state.allProducts])

  const handleProductClick = (product: any) => {
    dispatch({ type: "SET_SELECTED_PRODUCT", payload: product })
    dispatch({ type: "SET_PRODUCT_MODAL_OPEN", payload: true })
  }

  const handleCloseModal = () => {
    dispatch({ type: "SET_PRODUCT_MODAL_OPEN", payload: false })
    dispatch({ type: "SET_SELECTED_PRODUCT", payload: null })
  }

  const updateFilter = (key: string, value: any) => {
    dispatch({ type: "UPDATE_FILTERS", payload: { [key]: value } })
  }

  const clearAllFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" })
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" })
    dispatch({ type: "UPDATE_FILTERS", payload: { sortBy: "price-asc" } })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (state.filters.category !== "All Categories") count++
    if (state.filters.priceRange[0] > 0 || state.filters.priceRange[1] < 100000) count++
    if (state.filters.inStock) count++
    if (state.searchQuery.trim()) count++
    return count
  }

  const toggleBrand = (brand: string) => {
    const currentBrands = state.filters.brands
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand]
    updateFilter("brands", newBrands)
  }

  const getCurrentSortLabel = () => {
    const currentSort = sortOptions.find((option) => option.value === state.filters.sortBy)
    return currentSort ? currentSort.label : "Low Price"
  }

  const addToCart = (product: any) => {
    dispatch({ type: "ADD_TO_CART", payload: product })
  }

  const toggleFavorite = (product: any) => {
    const isFavorite = state.favorites.some((fav) => fav.id === product.id)
    if (isFavorite) {
      dispatch({ type: "REMOVE_FROM_FAVORITES", payload: product.id })
    } else {
      dispatch({ type: "ADD_TO_FAVORITES", payload: product })
    }
  }

  const isInCart = (productId: string) => {
    return state.cart.items.some((item) => item.id === productId)
  }

  const isFavorite = (productId: string) => {
    return state.favorites.some((fav) => fav.id === productId)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Shop Products</h1>
          <p className="text-xl text-gray-600">Browse and shop from our complete collection</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors text-lg"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </h2>
                {getActiveFiltersCount() > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl bg-transparent"
                  >
                    Clear All ({getActiveFiltersCount()})
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-black mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={state.filters.category === category}
                          onChange={() => updateFilter("category", category)}
                          className="mr-3 text-black focus:ring-black"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold text-black mb-3 flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <Slider
                      value={state.filters.priceRange}
                      onValueChange={(value) => updateFilter("priceRange", value)}
                      max={100000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatPrice(state.filters.priceRange[0])}</span>
                      <span>{formatPrice(state.filters.priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Status Filter */}
                <div>
                  <h3 className="font-semibold text-black mb-3 flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    Availability
                  </h3>
                  <label className="flex items-center cursor-pointer">
                    <Checkbox
                      checked={state.filters.inStock}
                      onCheckedChange={(checked) => updateFilter("inStock", checked)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">In Stock Only</span>
                  </label>
                </div>

                {/* Brand Filter */}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white border-2 border-gray-200 rounded-2xl">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden border-2 border-gray-200 rounded-xl hover:border-black"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                </Button>
                <span className="text-gray-600 font-medium">
                  Showing {filteredProducts.length} of {state.allProducts.length} products
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className="w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto min-w-[200px] h-12 px-6 border-2 border-black rounded-full bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 flex items-center justify-between text-base font-medium text-black"
                    >
                      <span className="truncate">{getCurrentSortLabel()}</span>
                      <ChevronDown className="h-5 w-5 flex-shrink-0 ml-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[200px] bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-2 mt-2"
                    align="end"
                    sideOffset={8}
                  >
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => updateFilter("sortBy", option.value)}
                        className={`cursor-pointer rounded-xl px-4 py-3 text-base font-medium transition-colors duration-150 ${
                          state.filters.sortBy === option.value
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Active Filters Display */}
            {getActiveFiltersCount() > 0 && (
              <div className="mb-6 p-4 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-black">Active Filters:</span>
                  {state.searchQuery && (
                    <Badge variant="secondary" className="bg-black text-white">
                      Search: "{state.searchQuery}"
                      <button
                        onClick={() => dispatch({ type: "SET_SEARCH_QUERY", payload: "" })}
                        className="ml-2 hover:bg-gray-700 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {state.filters.category !== "All Categories" && (
                    <Badge variant="secondary" className="bg-black text-white">
                      {state.filters.category}
                      <button
                        onClick={() => updateFilter("category", "All Categories")}
                        className="ml-2 hover:bg-gray-700 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                          onClick={() => toggleFavorite(product)}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                          onClick={() => handleProductClick(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-black line-clamp-2">{product.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-black">{formatPrice(product.price)}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">4.5</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {isInCart(product.id) ? "Added" : "Add to Cart"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Products Found */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms to see more products.</p>
                <Button onClick={clearAllFilters} className="bg-black text-white hover:bg-gray-800 rounded-xl">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <Dialog open={state.isProductModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {state.selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{state.selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={state.selectedProduct.image || "/placeholder.svg"}
                    alt={state.selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-3xl font-bold text-black mb-2">{formatPrice(state.selectedProduct.price)}</p>
                    <Badge variant={state.selectedProduct.inStock ? "default" : "destructive"}>
                      {state.selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{state.selectedProduct.description}</p>
                  <div className="space-y-2">
                    <p>
                      <strong>Category:</strong> {state.selectedProduct.category}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => addToCart(state.selectedProduct)}
                      disabled={!state.selectedProduct.inStock}
                      className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button onClick={() => toggleFavorite(state.selectedProduct)} variant="outline" className="px-6">
                      <Heart
                        className={`h-4 w-4 ${isFavorite(state.selectedProduct.id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
