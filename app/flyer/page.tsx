"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Truck,
  Clock,
  Shield,
  Star,
  Shirt,
  AnvilIcon as Iron,
  Package,
  CheckCircle,
  Phone,
  MapPin,
  Mail,
  Download,
  Share2,
} from "lucide-react"

export default function FlyerPage() {
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    setCurrentUrl(window.location.origin)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "WashAm - Professional Laundry Service",
          text: "Check out WashAm for premium laundry services with pickup and delivery!",
          url: currentUrl,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(currentUrl)
      alert("Website link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 p-4 print:p-0 print:bg-white">
      {/* Print/Share Controls - Hidden in print */}
      <div className="fixed top-4 right-4 z-50 flex space-x-2 print:hidden">
        <Button
          onClick={handleShare}
          size="sm"
          className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          onClick={handlePrint}
          size="sm"
          className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
        >
          <Download className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Main Flyer Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-2xl overflow-hidden print:shadow-none print:border-0">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white p-8 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 translate-y-10"></div>
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-white rounded-full translate-x-14 translate-y-14"></div>
            </div>

            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <Image src="/washam-logo.png" alt="WashAm Logo" width={120} height={120} className="drop-shadow-2xl" />
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">WashAm Dey For You! 🧺</h1>

              <p className="text-xl md:text-2xl mb-6 text-blue-100 font-medium">
                Professional Laundry Service • Pickup & Delivery
              </p>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">₵5 Pickup & Delivery Only!</h2>
                <p className="text-lg text-blue-100">
                  Premium cleaning • 24-48 hour service • 100% satisfaction guaranteed
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Services */}
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">🌟 Our Services</h3>

                <div className="space-y-4">
                  {/* Wash & Fold */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Shirt className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-800">Wash & Fold</h4>
                        <p className="text-sm text-blue-600">From ₵45 • Clean, dry & folded</p>
                      </div>
                    </div>
                  </div>

                  {/* Iron Service */}
                  <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-4 border-2 border-teal-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Iron className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-teal-800">Iron Service</h4>
                        <p className="text-sm text-teal-600">₵5 per item • Perfect pressing</p>
                      </div>
                    </div>
                  </div>

                  {/* Sneaker Cleaning */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border-2 border-emerald-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-800">Sneaker Cleaning</h4>
                        <p className="text-sm text-emerald-600">₵15 per pair • Deep clean</p>
                      </div>
                    </div>
                  </div>

                  {/* Dry Cleaning */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-800">Dry Cleaning</h4>
                        <p className="text-sm text-purple-600">Premium care • Delicate fabrics</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Choose Us */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">✨ Why Choose WashAm?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-slate-700">24-48 Hour Service</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-slate-700">100% Satisfaction</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Truck className="w-4 h-4 text-teal-500" />
                      <span className="text-slate-700">Free Pickup</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-slate-700">Premium Care</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - QR Code & Contact */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">📱 Order Online Now!</h3>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-blue-200 mb-6 inline-block">
                  <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center">
                    {currentUrl && (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          currentUrl,
                        )}&bgcolor=ffffff&color=1e3a5f&margin=10`}
                        alt="QR Code to WashAm Website"
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-600">Scan to visit our website</p>
                  <p className="text-xs text-slate-500 mt-1">washam.com</p>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-slate-800 mb-4 text-lg">📞 Contact Us</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">+233 XX XXX XXXX</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">info@washam.com</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">8AM - 10PM Daily</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Accra • Kumasi • Tema</span>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl p-6">
                  <h4 className="font-bold text-xl mb-2">Ready to Get Started?</h4>
                  <p className="text-blue-100 mb-4">Schedule your pickup today!</p>
                  <div className="text-2xl font-bold">📱 Scan • 📞 Call • 🧺 Relax</div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 pt-6 border-t-2 border-blue-100">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">🚀 How It Works</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">Schedule Pickup</h4>
                    <p className="text-sm text-slate-600">Book online or call us</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">We Clean</h4>
                    <p className="text-sm text-slate-600">Professional cleaning</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">Fast Delivery</h4>
                    <p className="text-sm text-slate-600">24-48 hours return</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl p-4">
                <p className="font-bold text-lg mb-1">WashAm Dey For You! 💙</p>
                <p className="text-blue-100 text-sm">
                  Your clothes deserve the best care • Made with ❤️ for clean clothes
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
