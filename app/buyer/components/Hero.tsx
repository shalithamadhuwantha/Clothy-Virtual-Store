"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag, Star, Users } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
                <Star className="h-4 w-4 mr-2 fill-current" />
                Premium Quality Products
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-black leading-tight">
                Clothy
                <span className="block text-gray-600">Virtual</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Discover premium products curated for the modern lifestyle. Quality, style, and innovation in every
                purchase.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/buyer/products">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 rounded-2xl px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/buyer/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-black text-black hover:bg-black hover:text-white rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-black">10K+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black">500+</div>
                <div className="text-gray-600 text-sm">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black">4.9</div>
                <div className="text-gray-600 text-sm flex items-center">
                  <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Element */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Product Showcase */}
              <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6 flex items-center justify-center">
                  <div className="w-32 h-32 bg-black rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Premium Collection</h3>
                <p className="text-gray-600 mb-4">Curated with care, delivered with excellence</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-black">From Rs. 8,500</span>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-black text-white p-4 rounded-2xl shadow-xl animate-bounce">
                <Users className="h-6 w-6" />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white border-2 border-black p-4 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-lg font-bold text-black">Free</div>
                  <div className="text-sm text-gray-600">Shipping</div>
                </div>
              </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gray-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-black rounded-full opacity-10 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-20 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </section>
  )
}
