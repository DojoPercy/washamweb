"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Truck,
  Clock,
  Shield,
  Star,
  Shirt,
  AnvilIcon as Iron,
  Package,
  CheckCircle,
  Sparkles,
  Phone,
  Menu,
  X,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { OrderTracker } from "@/components/order-tracker"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedService, setExpandedService] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/washam-logo.png" alt="WashAm Logo" width={40} height={40} className="rounded-lg" />
              <span className="font-bold text-lg text-slate-800 md:hidden">WashAm</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="#services" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
                Services
              </Link>
              <Link href="#pricing" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="#track" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
                Track Order
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-blue-100">
              <nav className="flex flex-col space-y-3 pt-4">
                <Link
                  href="#services"
                  className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="#pricing"
                  className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="#track"
                  className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Track Order
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Mobile-First Hero Section */}
      <section className="py-12 md:py-24 px-4 relative overflow-hidden min-h-[80vh] md:min-h-[85vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/african-laundry-facility.jpg"
            alt="Professional laundry facility in Ghana with modern washing machines"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-blue-900/75 to-slate-800/85"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center md:text-left">
            {/* Mobile Logo */}
            <div className="mb-6 md:mb-8 flex justify-center md:justify-start">
              <Image
                src="/washam-logo.png"
                alt="WashAm Logo"
                width={100}
                height={100}
                className="md:w-[140px] md:h-[140px] drop-shadow-2xl"
              />
            </div>

            {/* Mobile-Optimized Headlines */}
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
              Professional Laundry
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300 block">
                Made Simple
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-blue-100 mb-6 md:mb-8 leading-relaxed drop-shadow-md max-w-xl mx-auto md:mx-0">
              Premium laundry and dry cleaning services with convenient pickup and delivery. Your clothes deserve the
              best care.
            </p>

            {/* Mobile-First CTA Buttons */}
            <div className="flex flex-col space-y-4 mb-6 md:mb-8 md:flex-row md:space-y-0 md:space-x-4">
              <Link href="/order" className="w-full md:w-auto">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform active:scale-95 border-2 border-white/20"
                >
                  Schedule Your Pickup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full md:w-auto border-2 border-white/80 text-white bg-transperent hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm hover:border-white transition-all duration-300 active:scale-95"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </div>

            {/* Mobile Trust Indicators */}
            <div className="flex flex-col space-y-3 md:flex-row md:flex-wrap md:gap-4 md:space-y-0 items-center">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 w-full md:w-auto justify-center md:justify-start">
                <CheckCircle className="w-5 h-5 text-teal-300" />
                <span className="text-white font-medium">24-48 Hour Service</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 w-full md:w-auto justify-center md:justify-start">
                <Shield className="w-5 h-5 text-blue-300" />
                <span className="text-white font-medium">100% Satisfaction</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 w-full md:w-auto justify-center md:justify-start">
                <Truck className="w-5 h-5 text-emerald-300" />
                <span className="text-white font-medium">Free Pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Order Tracking */}
      <section id="track" className="py-12 md:py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 md:mb-4">Track Your Order</h2>
            <p className="text-lg md:text-xl text-slate-600">
              Enter your order number to check the status of your laundry
            </p>
          </div>
          <div className="flex justify-center">
            <OrderTracker />
          </div>
        </div>
      </section>

      {/* Mobile-First Features Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 md:mb-4">Why Choose WashAm?</h2>
            <p className="text-lg md:text-xl text-slate-600">Experience the difference with our premium service</p>
          </div>

          {/* Mobile-Optimized Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Truck,
                title: "Free Pickup & Delivery",
                description: "Convenient service right to your door with real-time tracking",
                color: "from-blue-500 to-blue-600",
                accent: "from-teal-400 to-teal-500",
              },
              {
                icon: Clock,
                title: "24-48 Hour Service",
                description: "Lightning-fast turnaround for your busy lifestyle",
                color: "from-teal-500 to-teal-600",
                accent: "from-orange-400 to-orange-500",
              },
              {
                icon: Shield,
                title: "100% Satisfaction",
                description: "Guaranteed quality or we'll make it right, every time",
                color: "from-emerald-500 to-emerald-600",
                accent: "from-blue-400 to-blue-500",
              },
              {
                icon: Star,
                title: "Premium Care",
                description: "Professional treatment for all fabrics with eco-friendly products",
                color: "from-purple-500 to-purple-600",
                accent: "from-pink-400 to-pink-500",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-active:scale-95 md:group-hover:scale-105`}
                  >
                    <feature.icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <div
                    className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${feature.accent} rounded-full flex items-center justify-center`}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">{feature.title}</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Services & Pricing */}
      <section id="pricing" className="py-12 md:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 md:mb-6">Our Services & Pricing</h2>
            <p className="text-lg md:text-xl text-slate-600 mb-4 md:mb-6">Estimate your order cost</p>
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-200 rounded-2xl p-4 md:p-6 max-w-3xl mx-auto">
              <p className="text-slate-700 font-medium text-base md:text-lg">
                💡 These prices are estimates to help you plan your order.
                <br />
                <span className="text-blue-600">
                  Final pricing will be confirmed when we assess your items at pickup.
                </span>
              </p>
            </div>
          </div>

          {/* Mobile-First Service Cards */}
          <div className="space-y-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:space-y-0">
            {[
              {
                title: "Wash & Fold",
                image: "/folded-clothes.jpg",
                icon: Shirt,
                color: "blue",
                items: [
                  { name: "Small Bag (3kg)", price: "~₵45" },
                  { name: "Medium Bag (5kg)", price: "~₵80" },
                  { name: "Large Bag (8kg)", price: "~₵150" },
                ],
                note: "*Estimates based on typical loads",
              },
              {
                title: "Iron Service",
                image: "/ironed-shirts.jpg",
                icon: Iron,
                color: "teal",
                items: [{ name: "Per Item", price: "~₵5" }],
                description: "Perfect pressing for shirts, pants, dresses & more",
                note: "*Final count at pickup",
              },
              {
                title: "Sneaker Cleaning",
                image: "/clean-sneakers.jpg",
                icon: Package,
                color: "emerald",
                items: [{ name: "Per Pair", price: "~₵15" }],
                description: "Deep cleaning, stain removal & deodorizing",
                note: "*Price may vary by condition",
              },
              {
                title: "Dry Cleaning",
                image: "/formal-wear.jpg",
                icon: Star,
                color: "purple",
                items: [{ name: "Pricing", price: "At Pickup" }],
                description: "Suits, formal wear & delicate fabrics",
                note: "*Depends on garment type",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group active:scale-95 md:hover:scale-105"
              >
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={`${service.title} service`}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-${service.color}-600/80 to-transparent`}
                  ></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-3 md:mb-4">{service.title}</h3>
                  <div className="space-y-2 md:space-y-3">
                    {service.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm md:text-base">{item.name}</span>
                        <span className={`font-bold text-${service.color}-600 text-base md:text-lg`}>{item.price}</span>
                      </div>
                    ))}
                    {service.description && <p className="text-slate-600 text-sm">{service.description}</p>}
                  </div>
                  <p className="text-xs text-slate-500 mt-3 md:mt-4 italic">{service.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile-Optimized Delivery Info */}
          <div className="mt-12 md:mt-16 text-center">
            <Card className="inline-block p-6 md:p-8 bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-200 shadow-lg w-full max-w-md md:w-auto">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg md:text-xl">Pickup & Delivery</h4>
                  <p className="text-slate-600 text-base md:text-lg">Only ₵5 per order</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Process Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 md:mb-4">How It Works</h2>
            <p className="text-lg md:text-xl text-slate-600">Simple steps to get your clothes professionally cleaned</p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
            {[
              {
                step: "1",
                title: "Schedule Pickup",
                description: "Book online and we'll collect your clothes at your convenience",
                image: "/laundry-basket.jpg",
                color: "from-blue-500 to-blue-600",
              },
              {
                step: "2",
                title: "Professional Clean",
                description: "Expert cleaning with premium products and careful attention",
                image: "/washing-machine-hero.png",
                color: "from-teal-500 to-teal-600",
              },
              {
                step: "3",
                title: "Fast Delivery",
                description: "Clean clothes delivered back to you within 24-48 hours",
                image: "/delivery-truck.jpg",
                color: "from-emerald-500 to-emerald-600",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <Image
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                  <div
                    className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                  >
                    {step.step}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg md:text-xl">{step.title}</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-Optimized CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/washing-machine-hero.png" alt="Background" fill className="object-cover" />
        </div>
        <div className="container mx-auto text-center max-w-4xl relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 md:mb-10 leading-relaxed">
            Schedule your pickup today and experience the convenience of professional laundry service with our premium
            care guarantee.
          </p>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-center">
            <Link href="/order" className="w-full md:w-auto">
              <Button
                size="lg"
                className="w-full md:w-auto bg-white hover:bg-blue-50 text-blue-600 px-8 md:px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95"
              >
                Schedule Your Pickup Now
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full md:w-auto border-2 border-white text-white hover:bg-white/10 px-8 md:px-10 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm active:scale-95"
            >
              Call Us: +233 XX XXX XXXX
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Footer */}
      <footer className="bg-slate-900 text-white py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
                <Image src="/washam-logo.png" alt="WashAm Logo" width={40} height={40} className="rounded" />
                <span className="font-bold text-lg">WashAm</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Professional laundry services with convenient pickup and delivery across Ghana.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-6 text-lg">Services</h4>
              <ul className="space-y-3 text-slate-300">
                <li className="hover:text-teal-400 transition-colors cursor-pointer py-1">Wash & Fold</li>
                <li className="hover:text-teal-400 transition-colors cursor-pointer py-1">Iron Service</li>
                <li className="hover:text-teal-400 transition-colors cursor-pointer py-1">Sneaker Cleaning</li>
                <li className="hover:text-teal-400 transition-colors cursor-pointer py-1">Dry Cleaning</li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-6 text-lg">Contact</h4>
              <ul className="space-y-3 text-slate-300">
                <li className="py-1">Phone: +233 XX XXX XXXX</li>
                <li className="py-1">Email: info@washam.com</li>
                <li className="py-1">Hours: 8AM - 10PM Daily</li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-6 text-lg">Service Areas</h4>
              <ul className="space-y-3 text-slate-300">
                <li className="py-1">Accra & Surroundings</li>
                <li className="py-1">Kumasi</li>
                <li className="py-1">Tema</li>
                <li className="text-teal-400 py-1">More areas coming soon</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 WashAm. All rights reserved. | Made with ❤️ for clean clothes</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
