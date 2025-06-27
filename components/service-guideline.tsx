"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, CheckCircle, AlertTriangle, Shirt, Star, Info, Sparkles, Calculator } from "lucide-react"

interface ServiceGuidelinesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ServiceGuidelinesModal({ isOpen, onClose }: ServiceGuidelinesModalProps) {
  const [currentTab, setCurrentTab] = useState<"guidelines" | "pricing">("guidelines")

  if (!isOpen) return null

  const washFoldItems = [
    "T-shirts & Tank tops",
    "Shirts & Blouses",
    "Trousers & Jeans",
    "Underwear & Bras",
    "Dresses (casual)",
    "Pajamas & Nightwear",
    "Skirts & Shorts",
    "Socks & Leggings",
    "Light Scarves",
  ]

  const notAllowedItems = [
    "Bedsheets & Duvets",
    "Heavy Towels",
    "Curtains & Rugs",
    "Jackets & Coats",
    "Suits & Blazers",
    "Wool, Silk, Lace",
    "Traditional Wear",
    "Shoes & Bags",
    "Baby Blankets",
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border-0 animate-scale-in">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white p-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 translate-y-12"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">Before You Continue</CardTitle>
                  <p className="text-blue-100 text-sm">Important service information</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentTab("guidelines")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentTab === "guidelines"
                    ? "bg-white/20 text-white border-2 border-white/30"
                    : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <Shirt className="w-4 h-4 mr-2 inline" />
                Service Guidelines
              </button>
              <button
                onClick={() => setCurrentTab("pricing")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentTab === "pricing"
                    ? "bg-white/20 text-white border-2 border-white/30"
                    : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <Calculator className="w-4 h-4 mr-2 inline" />
                Pricing Info
              </button>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
          {currentTab === "guidelines" && (
            <div className="p-6 space-y-6">
              {/* Wash & Fold Guidelines */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Wash & Fold Guidelines</h3>
                    <p className="text-sm text-slate-600">What's included in regular wash & fold service</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 mb-6">
                  <p className="text-green-800 font-medium mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Wash & Fold is for regular, everyday clothing only:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {washFoldItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-green-700">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                  <p className="text-red-800 font-medium mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    These items require Dry Cleaning or Special Care:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {notAllowedItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-red-700">
                        <X className="w-3 h-3 text-red-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Tip */}
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Quick Tip</h4>
                    <p className="text-blue-700 text-sm">
                      Ask yourself: <em>"Would I toss this in a regular machine wash with my casual clothes?"</em>
                      <br />
                      If no, it's probably not for Wash & Fold.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === "pricing" && (
            <div className="p-6 space-y-6">
              {/* Pricing Information */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Pricing Information</h3>
                    <p className="text-sm text-slate-600">How our pricing works</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Estimate Notice */}
                  <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-2">Pricing Estimate Notice</h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>
                            • The amounts shown are <strong>rough estimates</strong> to help you plan
                          </li>
                          <li>
                            • Final pricing is confirmed <strong>after pickup and inspection</strong>
                          </li>
                          <li>• You only pay for what we actually process</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* How We Price */}
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      How We Determine Final Pricing
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-blue-800">Item Assessment</p>
                          <p className="text-blue-700 text-sm">
                            We check each item's fabric type and care requirements
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-blue-800">Weight & Count</p>
                          <p className="text-blue-700 text-sm">Accurate measurement of your actual load</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-blue-800">Service Classification</p>
                          <p className="text-blue-700 text-sm">Items sorted into appropriate service categories</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transparency Promise */}
                  <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-emerald-800 mb-2">Our Transparency Promise</h4>
                        <ul className="text-emerald-700 text-sm space-y-1">
                          <li>• No hidden fees or surprise charges</li>
                          <li>• Clear breakdown of all costs</li>
                          <li>• You approve final pricing before we start</li>
                          <li>• 100% satisfaction guarantee</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CheckCircle className="w-5 h-5 mr-2" />I Understand & Agree
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="sm:w-auto border-2 border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold py-3 rounded-xl bg-transparent"
            >
              Close
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-3">
            By continuing, you acknowledge that you understand our service guidelines and pricing policy.
          </p>
        </div>
      </Card>
    </div>
  )
}
