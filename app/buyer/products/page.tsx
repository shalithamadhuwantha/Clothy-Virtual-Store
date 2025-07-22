"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import ProductCard from "../components/ProductCard"
import ProductModal from "../components/ProductModal"
import { useApp } from "../contexts/AppContext"

export default function ProductsPage() {
  const { state, dispatch, getFilteredProducts } = useApp()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const filteredProducts = getFilteredProducts()

  const categories = ["All Categories", "T Shirt", "Pants", "Dress", "Home"]
  const sortOptions = [
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ]

  const handleFilterChange = (filterType: string, value: any) => {
    dispatch({ type: "UPDATE_FILTERS", payload: { [filterType]: value } })
  }

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" })
  }

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Products</h1>
            <p className="text-gray-600">Discover our premium collection</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Sort Dropdown */}
            <select
              value={state.filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-none ${viewMode === "grid" ? "bg-black text-white" : ""}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-none ${viewMode === "list" ? "bg-black text-white" : ""}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-2 border-gray-200 rounded-xl"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-black">
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-black mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={state.filters.category === category}
                          onChange={(e) => handleFilterChange("category", e.target.value)}
                          className="mr-3 text-black focus:ring-black"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold text-black mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Min Price (LKR)</label>
                      <input
                        type="number"
                        value={state.filters.priceRange[0]}
                        onChange={(e) =>
                          handleFilterChange("priceRange", [Number(e.target.value), state.filters.priceRange[1]])
                        }
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Max Price (LKR)</label>
                      <input
                        type="number"
                        value={state.filters.priceRange[1]}
                        onChange={(e) =>
                          handleFilterChange("priceRange", [state.filters.priceRange[0], Number(e.target.value)])
                        }
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                        placeholder="100000"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Filter */}
                <div>
                  <h3 className="font-semibold text-black mb-3">Availability</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={state.filters.inStock}
                      onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                      className="mr-3 text-black focus:ring-black"
                    />
                    <span className="text-gray-700">In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {state.allProducts.length} products
              </p>

              {/* Active Filters */}
              {(state.filters.category !== "All Categories" ||
                state.filters.inStock ||
                state.filters.priceRange[0] > 0 ||
                state.filters.priceRange[1] < 100000) && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {state.filters.category !== "All Categories" && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">{state.filters.category}</span>
                  )}
                  {state.filters.inStock && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">In Stock</span>
                  )}
                </div>
              )}
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <SlidersHorizontal className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} className="bg-black text-white hover:bg-gray-800 rounded-xl">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
