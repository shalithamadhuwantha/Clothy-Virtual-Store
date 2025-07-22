"use client"

import ProductCard from "../components/ProductCard"
import { Button } from "@/components/ui/button"
import { Filter, ChevronDown, X, Search, Package, DollarSign } from "lucide-react"
import { useState, useMemo } from "react"
import ProductModal from "../components/ProductModal"
import { useApp, AppProvider } from "../contexts/AppContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

const categories = ["All Categories", "T Shirt", "Dress", "Pants", "Home"]
const sortOptions = [
  { label: "Low Price", value: "price-asc" },
  { label: "High Price", value: "price-desc" },
]

function getCurrentSortLabel() {
  const selectedOption = sortOptions.find((option) => option.value === window.state.filters.sortBy)
  return selectedOption ? selectedOption.label : "Sort by"
}

function ProductsPageInner() {
  const { state, dispatch, formatPrice, getFilteredProducts } = useApp()
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => getFilteredProducts(), [state.filters, state.searchQuery, state.allProducts])

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
    // Set default sort to Low Price
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Our Products</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Explore our complete collection of premium products</p>
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

              {/* Responsive Sort Dropdown */}
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
                    <span className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center">
                      Search: "{state.searchQuery}"
                      <button
                        onClick={() => dispatch({ type: "SET_SEARCH_QUERY", payload: "" })}
                        className="ml-2 hover:bg-gray-700 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {state.filters.category !== "All Categories" && (
                    <span className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center">
                      {state.filters.category}
                      <button
                        onClick={() => updateFilter("category", "All Categories")}
                        className="ml-2 hover:bg-gray-700 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {state.filters.inStock && (
                    <span className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center">
                      In Stock Only
                      <button
                        onClick={() => updateFilter("inStock", false)}
                        className="ml-2 hover:bg-gray-700 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
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

      {/* Global Product Modal */}
      <ProductModal product={state.selectedProduct} isOpen={state.isProductModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <AppProvider>
      <ProductsPageInner />
    </AppProvider>
  )
}
