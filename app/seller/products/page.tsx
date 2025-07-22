"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Package, ImageIcon } from "lucide-react"
import { useSeller } from "@/app/seller/contexts/SellerContext"
import ProductForm from "../components/ProductForm"

export default function SellerProducts() {
  const { state, dispatch, formatPrice } = useSeller()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredProducts = state.products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    setIsFormOpen(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch({ type: "DELETE_PRODUCT", payload: productId })
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Add Product */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg line-clamp-2">{product.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                  </div>
                  <Badge variant={product.inStock ? "default" : "secondary"} className="shrink-0">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.images.length > 1 && (
                        <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs">
                          +{product.images.length - 1}
                        </Badge>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg sm:text-xl font-bold text-black">{formatPrice(product.price)}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <Package className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">
              {searchQuery ? "No products found" : "No products yet"}
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 px-4">
              {searchQuery ? "Try adjusting your search terms" : "Start by adding your first product to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsFormOpen(true)} className="bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product Form Modal */}
      {isFormOpen && <ProductForm product={selectedProduct} onClose={handleCloseForm} />}
    </div>
  )
}
