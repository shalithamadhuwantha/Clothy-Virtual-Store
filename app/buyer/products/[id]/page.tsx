import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Share2 } from "lucide-react"

// Mock product data - in a real app, this would come from a database
const getProduct = (id: string) => {
  const products = {
    "1": {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 299,
      originalPrice: 399,
      image: "/placeholder.svg?height=600&width=600",
      images: [
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
      ],
      description:
        "Experience premium audio quality with our flagship wireless headphones. Featuring advanced noise cancellation technology, premium materials, and exceptional comfort for all-day wear.",
      features: [
        "Active Noise Cancellation",
        "30-hour battery life",
        "Premium leather headband",
        "Hi-Res Audio certified",
        "Quick charge: 5 min = 2 hours playback",
      ],
      inStock: true,
    },
  }
  return products[id as keyof typeof products]
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square border-2 border-black rounded-2xl overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square border-2 border-black rounded-xl overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-black mb-4">{product.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-black">${product.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>

            <div>
              <h3 className="text-xl font-bold text-black mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl py-4 text-lg font-semibold"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-black rounded-xl py-4">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-black rounded-xl py-4">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 border-2 border-black rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-black">{product.inStock ? "In Stock" : "Out of Stock"}</span>
                <span className="text-gray-600">Free shipping on orders over $100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
