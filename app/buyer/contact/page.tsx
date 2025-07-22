import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="border-2 border-black rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-black mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-semibold mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-gray-600"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-gray-600"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-gray-600"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Subject</label>
                <select className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-gray-600 bg-white">
                  <option>General Inquiry</option>
                  <option>Product Support</option>
                  <option>Order Status</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-gray-600 resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-black text-white hover:bg-gray-800 rounded-xl py-4 text-lg font-semibold"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="border-2 border-black rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-black mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Email</h3>
                    <p className="text-gray-600">contact@clothyvirtual.com</p>
                    <p className="text-gray-600">support@clothyvirtual.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Phone</h3>
                    <p className="text-gray-600">+71 7 1234-5678</p>
                    <p className="text-gray-600">+71 7 9876-5432</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Address</h3>
                    <p className="text-gray-600">1st Street</p>
                    <p className="text-gray-600">Kandy, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="border-2 border-black rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-black mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-black mb-2">What is your return policy?</h4>
                  <p className="text-gray-600 text-sm">
                    We offer a 30-day return policy for all unused items in original packaging.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-2">How long does shipping take?</h4>
                  <p className="text-gray-600 text-sm">
                    Standard shipping takes 3-5 business days, express shipping takes 1-2 business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-2">Do you ship internationally?</h4>
                  <p className="text-gray-600 text-sm">
                    Yes, we ship to over 50 countries worldwide. Shipping costs vary by location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
