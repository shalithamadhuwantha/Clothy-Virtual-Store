import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="border-4 border-black rounded-3xl p-12 md:p-20 bg-white shadow-2xl">
          <h1 className="text-4xl md:text-7xl font-bold text-black mb-6 leading-tight">
            Premium
            <br />
            <span className="bg-black text-white px-4 py-2 rounded-xl inline-block mt-2">Commerce</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium products designed for the modern lifestyle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 rounded-xl px-8 py-4 text-lg font-semibold"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl px-8 py-4 text-lg font-semibold"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
