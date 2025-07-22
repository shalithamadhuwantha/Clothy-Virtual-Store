import { Users, Award, Globe, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">About Clothy Virtual</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're passionate about bringing you the finest selection of premium products, carefully curated for the
            modern lifestyle. Our commitment to quality and customer satisfaction drives everything we do.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="border-2 border-black rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-black mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded in 2020, Clothy Virtual began as a vision to create a premium e-commerce experience that
              prioritizes quality over quantity. We believe that every product should tell a story and serve a purpose
              in your life.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our team of experts carefully selects each item in our collection, ensuring that it meets our high
              standards for design, functionality, and sustainability. We're not just selling products; we're curating
              experiences.
            </p>
          </div>
          <div className="border-2 border-black rounded-2xl overflow-hidden">
            <div className="h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <p className="text-lg font-semibold text-black">Crafted with passion, delivered with care</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-black text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Quality First",
                description: "Every product is carefully selected and tested to meet our premium standards.",
              },
              {
                icon: Users,
                title: "Customer Focused",
                description: "Your satisfaction is our priority. We listen, adapt, and improve continuously.",
              },
              {
                icon: Globe,
                title: "Sustainable",
                description: "We partner with s that share our commitment to environmental responsibility.",
              },
              {
                icon: Heart,
                title: "Passionate",
                description: "We love what we do, and it shows in every interaction and product we offer.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center border-2 border-black rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-black mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "Founder & CEO", image: "/placeholder.svg?height=300&width=300" },
              { name: "Michael Chen", role: "Head of Product", image: "/placeholder.svg?height=300&width=300" },
              { name: "Emily Rodriguez", role: "Customer Experience", image: "/placeholder.svg?height=300&width=300" },
            ].map((member, index) => (
              <div key={index} className="border-2 border-black rounded-2xl p-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <Users className="h-16 w-16 text-gray-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
