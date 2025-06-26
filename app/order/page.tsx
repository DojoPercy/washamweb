"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Package,
  Shirt,
  AnvilIcon as Iron,
  CheckCircle,
  Copy,
  Plus,
  Minus,
  Star,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Truck,
  Sparkles,
  ShoppingCart,
  CreditCard,
  Gift,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AddressAutocomplete } from "@/components/address-autocomplete"
import { SimpleAddressAutocomplete } from "@/components/simple-address-autocomplete"

interface OrderItem {
  service: string
  quantity: number
  price: number
}

export default function OrderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedServices, setSelectedServices] = useState<OrderItem[]>([])
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    instructions: "",
  })
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addService = (service: string, price: number) => {
    const existing = selectedServices.find((item) => item.service === service)
    if (existing) {
      setSelectedServices((prev) =>
        prev.map((item) => (item.service === service ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setSelectedServices((prev) => [...prev, { service, quantity: 1, price }])
    }
  }

  const removeService = (service: string) => {
    setSelectedServices((prev) => prev.filter((item) => item.service !== service))
  }

  const updateQuantity = (service: string, quantity: number) => {
    if (quantity === 0) {
      removeService(service)
    } else {
      setSelectedServices((prev) => prev.map((item) => (item.service === service ? { ...item, quantity } : item)))
    }
  }

  const subtotal = selectedServices.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 5
  const total = subtotal + deliveryFee

  const generateOrderNumber = () => {
    const prefix = "WA"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${prefix}${timestamp}${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Generate order number
      const newOrderNumber = generateOrderNumber()

      // Prepare order data
      const orderData = {
        orderNumber: newOrderNumber,
        services: selectedServices,
        pickup: { date: pickupDate, time: pickupTime },
        customer: customerInfo,
        subtotal,
        deliveryFee,
        total,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      }

      // Submit to database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        // Store order in localStorage for demo purposes (backup)
        const existingOrders = JSON.parse(localStorage.getItem("washAmOrders") || "[]")
        existingOrders.push(orderData)
        localStorage.setItem("washAmOrders", JSON.stringify(existingOrders))

        setOrderNumber(newOrderNumber)
        setOrderSubmitted(true)
      } else {
        throw new Error(result.error || "Failed to submit order")
      }
    } catch (error) {
      console.error("Order submission error:", error)
      alert("Failed to submit order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber)
    alert("Order number copied to clipboard!")
  }

  const startNewOrder = () => {
    setOrderSubmitted(false)
    setOrderNumber("")
    setSelectedServices([])
    setPickupDate("")
    setPickupTime("")
    setCurrentStep(1)
    setCustomerInfo({
      name: "",
      phone: "",
      email: "",
      address: "",
      instructions: "",
    })
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2:
        return selectedServices.length > 0
      case 3:
        return pickupDate !== ""
      case 4:
        return customerInfo.name && customerInfo.phone && customerInfo.address
      default:
        return true
    }
  }

  // Order Confirmation View
  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/washam-logo.png" alt="WashAm Logo" width={40} height={40} className="rounded-lg" />
              <span className="font-bold text-xl text-slate-800">Order Confirmed!</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mx-auto animate-ping opacity-20"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">🎉 Order Confirmed!</h1>
            <p className="text-xl text-slate-600 mb-6">Your laundry pickup has been scheduled successfully</p>

            {/* Celebration badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm">
                <Zap className="w-4 h-4 mr-2" />
                Fast Processing
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
                <Gift className="w-4 h-4 mr-2" />
                Premium Care
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">
                <Star className="w-4 h-4 mr-2" />
                Quality Guaranteed
              </Badge>
            </div>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8 border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-center text-2xl font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Order Number */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-3 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border-2 border-blue-200">
                  <span className="text-lg text-slate-600">Order Number:</span>
                  <span className="text-3xl font-bold text-blue-600">{orderNumber}</span>
                  <Button variant="ghost" size="sm" onClick={copyOrderNumber} className="p-2 hover:bg-blue-100">
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Pickup Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <Truck className="w-6 h-6 mr-2 text-blue-600" />
                    Pickup Details
                  </h3>
                  <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                    <p className="flex items-center text-slate-700">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <strong>Date:</strong> <span className="ml-2">{pickupDate}</span>
                    </p>
                    <p className="flex items-center text-slate-700">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      <strong>Time:</strong> <span className="ml-2">{pickupTime || "Any time"}</span>
                    </p>
                    <p className="flex items-start text-slate-700">
                      <MapPin className="w-4 h-4 mr-2 mt-1 text-blue-600" />
                      <strong>Location:</strong> <span className="ml-2">{customerInfo.address}</span>
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <User className="w-6 h-6 mr-2 text-emerald-600" />
                    Contact Info
                  </h3>
                  <div className="bg-emerald-50 rounded-xl p-4 space-y-2">
                    <p className="flex items-center text-slate-700">
                      <User className="w-4 h-4 mr-2 text-emerald-600" />
                      <strong>Name:</strong> <span className="ml-2">{customerInfo.name}</span>
                    </p>
                    <p className="flex items-center text-slate-700">
                      <Phone className="w-4 h-4 mr-2 text-emerald-600" />
                      <strong>Phone:</strong> <span className="ml-2">{customerInfo.phone}</span>
                    </p>
                    {customerInfo.email && (
                      <p className="flex items-center text-slate-700">
                        <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                        <strong>Email:</strong> <span className="ml-2">{customerInfo.email}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <Package className="w-6 h-6 mr-2 text-purple-600" />
                  Services Requested
                </h3>
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="space-y-3">
                    {selectedServices.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <span className="font-medium text-slate-700">
                          {item.service} × {item.quantity}
                        </span>
                        <span className="font-bold text-purple-600">
                          ₵{item.price > 0 ? item.price * item.quantity : "TBD"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-purple-200 mt-4 pt-4">
                    <div className="flex justify-between text-lg mb-2">
                      <span className="text-slate-600">Estimated Subtotal</span>
                      <span className="font-semibold">₵{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-lg mb-3">
                      <span className="text-slate-600">Pickup & Delivery</span>
                      <span className="font-semibold">₵{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-purple-600 border-t border-purple-200 pt-3">
                      <span>Estimated Total</span>
                      <span>₵{total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-6 border-2 border-blue-200">
                <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  What happens next?
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <p className="text-slate-700">SMS confirmation sent to your phone</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <p className="text-slate-700">Final pricing confirmed at pickup</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <p className="text-slate-700">30-minute pickup reminder</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <p className="text-slate-700">24-48 hour return delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={startNewOrder}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Another Order
            </Button>
            <Link href="/" className="flex-1 sm:flex-none">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Enhanced Order Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <Image src="/washam-logo.png" alt="WashAm Logo" width={40} height={40} className="rounded-lg" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Schedule Your Order</h1>
                  <p className="text-sm text-slate-600">Step {currentStep} of 4</p>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            {selectedServices.length > 0 && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>{selectedServices.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                </div>
                <div className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Est. ₵{total}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { step: 1, title: "Services", icon: Package },
              { step: 2, title: "Schedule", icon: Calendar },
              { step: 3, title: "Details", icon: User },
              { step: 4, title: "Review", icon: CheckCircle },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`flex items-center space-x-2 ${
                    currentStep >= item.step
                      ? "text-blue-600"
                      : currentStep === item.step
                        ? "text-blue-500"
                        : "text-slate-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      currentStep > item.step
                        ? "bg-blue-600 border-blue-600 text-white"
                        : currentStep === item.step
                          ? "bg-blue-100 border-blue-500 text-blue-600"
                          : "bg-slate-100 border-slate-300 text-slate-400"
                    }`}
                  >
                    {currentStep > item.step ? <CheckCircle className="w-5 h-5" /> : <item.icon className="w-5 h-5" />}
                  </div>
                  <span className="hidden sm:block font-medium">{item.title}</span>
                </div>
                {index < 3 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 mx-2 md:mx-4 transition-all duration-300 ${
                      currentStep > item.step ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Services Selection */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">What services do you need?</h2>
                <p className="text-lg text-slate-600">
                  Select the services you'd like and tell us approximately how much you have
                </p>
              </div>

              {/* Service Cards */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Wash & Fold */}
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="h-48 relative">
                    <Image src="/folded-clothes.jpg" alt="Wash & Fold service" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Shirt className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Wash & Fold</h3>
                    <p className="text-slate-600 mb-6">Clean, dry, and neatly folded clothes ready to wear</p>

                    <div className="space-y-4">
                      {[
                        { name: "Small Bag (3kg)", price: 45, desc: "1-2 days of clothes", popular: false },
                        { name: "Medium Bag (5kg)", price: 80, desc: "Perfect for a week", popular: true },
                        { name: "Large Bag (8kg)", price: 150, desc: "Family size or bulk", popular: false },
                      ].map((item) => {
                        const selected = selectedServices.find((s) => s.service === `Wash & Fold - ${item.name}`)
                        return (
                          <div
                            key={item.name}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                              selected
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            {item.popular && (
                              <Badge className="absolute -top-2 left-4 bg-orange-500 text-white">Most Popular</Badge>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-slate-800">{item.name}</span>
                                  <span className="text-xl font-bold text-blue-600">₵{item.price}</span>
                                </div>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                {selected && (
                                  <>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        updateQuantity(`Wash & Fold - ${item.name}`, selected.quantity - 1)
                                      }
                                      className="w-8 h-8 p-0 rounded-full"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-8 text-center font-bold text-blue-600">{selected.quantity}</span>
                                  </>
                                )}
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => addService(`Wash & Fold - ${item.name}`, item.price)}
                                  className="w-8 h-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Other Services */}
                <div className="space-y-6">
                  {/* Iron Service */}
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Iron className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">Iron Service</h3>
                          <p className="text-slate-600">Professional pressing</p>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedServices.find((s) => s.service === "Iron Service")
                            ? "border-orange-500 bg-orange-50"
                            : "border-slate-200 bg-white hover:border-orange-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-800">Approximate Items</span>
                            <p className="text-sm text-slate-600">₵5 per item</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {selectedServices.find((s) => s.service === "Iron Service") && (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      "Iron Service",
                                      selectedServices.find((s) => s.service === "Iron Service")!.quantity - 1,
                                    )
                                  }
                                  className="w-8 h-8 p-0 rounded-full"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-bold text-orange-600">
                                  {selectedServices.find((s) => s.service === "Iron Service")?.quantity}
                                </span>
                              </>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => addService("Iron Service", 5)}
                              className="w-8 h-8 p-0 rounded-full bg-orange-600 hover:bg-orange-700"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sneaker Cleaning */}
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">Sneaker Cleaning</h3>
                          <p className="text-slate-600">Deep clean & restore</p>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedServices.find((s) => s.service === "Sneaker Cleaning")
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-emerald-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-800">Number of Pairs</span>
                            <p className="text-sm text-slate-600">₵15 per pair</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {selectedServices.find((s) => s.service === "Sneaker Cleaning") && (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      "Sneaker Cleaning",
                                      selectedServices.find((s) => s.service === "Sneaker Cleaning")!.quantity - 1,
                                    )
                                  }
                                  className="w-8 h-8 p-0 rounded-full"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-bold text-emerald-600">
                                  {selectedServices.find((s) => s.service === "Sneaker Cleaning")?.quantity}
                                </span>
                              </>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => addService("Sneaker Cleaning", 15)}
                              className="w-8 h-8 p-0 rounded-full bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dry Cleaning */}
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Star className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">Dry Cleaning</h3>
                          <p className="text-slate-600">Delicate & formal wear</p>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedServices.find((s) => s.service === "Dry Cleaning")
                            ? "border-purple-500 bg-purple-50"
                            : "border-slate-200 bg-white hover:border-purple-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-800">Approximate Items</span>
                            <p className="text-sm text-slate-600">Priced at pickup</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {selectedServices.find((s) => s.service === "Dry Cleaning") && (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      "Dry Cleaning",
                                      selectedServices.find((s) => s.service === "Dry Cleaning")!.quantity - 1,
                                    )
                                  }
                                  className="w-8 h-8 p-0 rounded-full"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-bold text-purple-600">
                                  {selectedServices.find((s) => s.service === "Dry Cleaning")?.quantity}
                                </span>
                              </>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => addService("Dry Cleaning", 0)}
                              className="w-8 h-8 p-0 rounded-full bg-purple-600 hover:bg-purple-700"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Continue Button */}
              <div className="text-center">
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToStep(2)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {selectedServices.length === 0
                    ? "Select Services to Continue"
                    : `Continue with ${selectedServices.reduce((sum, item) => sum + item.quantity, 0)} items`}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Schedule Pickup */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">When should we pick up?</h2>
                <p className="text-lg text-slate-600">Choose a convenient date and time for your laundry pickup</p>
              </div>

              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Pickup Info */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-blue-800">Pickup Information</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>We pickup between 8AM - 10PM daily</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>30-minute heads up via SMS</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Free pickup & delivery</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>24-48 hour turnaround</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="pickup-date" className="text-lg font-semibold text-slate-800 mb-2 block">
                          Pickup Date *
                        </Label>
                        <Input
                          id="pickup-date"
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required
                          className="h-12 text-lg border-2 border-slate-300 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickup-time" className="text-lg font-semibold text-slate-800 mb-2 block">
                          Preferred Time (Optional)
                        </Label>
                        <Select value={pickupTime} onValueChange={setPickupTime}>
                          <SelectTrigger className="h-12 text-lg border-2 border-slate-300 focus:border-blue-500 rounded-xl">
                            <SelectValue placeholder="Any time works" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                            <SelectItem value="evening">Evening (5PM - 10PM)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToStep(3)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  Continue
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Customer Details */}
          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Your contact details</h2>
                <p className="text-lg text-slate-600">
                  We need this information to coordinate your pickup and delivery
                </p>
              </div>

              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-lg font-semibold text-slate-800 mb-2 block flex items-center"
                        >
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                          required
                          className="h-12 text-lg border-2 border-slate-300 focus:border-blue-500 rounded-xl"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-lg font-semibold text-slate-800 mb-2 block flex items-center"
                        >
                          <Phone className="w-5 h-5 mr-2 text-emerald-600" />
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                          required
                          className="h-12 text-lg border-2 border-slate-300 focus:border-emerald-500 rounded-xl"
                          placeholder="0XX XXX XXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-lg font-semibold text-slate-800 mb-2 block flex items-center"
                      >
                        <Mail className="w-5 h-5 mr-2 text-purple-600" />
                        Email Address (Optional)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                        className="h-12 text-lg border-2 border-slate-300 focus:border-purple-500 rounded-xl"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <Label className="text-lg font-semibold text-slate-800 mb-2 block flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                        Pickup Location *
                      </Label>
                      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                        <AddressAutocomplete
                          value={customerInfo.address}
                          onChange={(value) => setCustomerInfo((prev) => ({ ...prev, address: value }))}
                          placeholder="Search for your location..."
                          required
                        />
                      ) : (
                        <SimpleAddressAutocomplete
                          value={customerInfo.address}
                          onChange={(value) => setCustomerInfo((prev) => ({ ...prev, address: value }))}
                          placeholder="Search for your location..."
                          required
                        />
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="instructions"
                        className="text-lg font-semibold text-slate-800 mb-2 block flex items-center"
                      >
                        <MessageSquare className="w-5 h-5 mr-2 text-teal-600" />
                        Special Instructions (Optional)
                      </Label>
                      <Textarea
                        id="instructions"
                        value={customerInfo.instructions}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, instructions: e.target.value }))}
                        placeholder="Building access, parking instructions, gate codes, etc."
                        className="min-h-[100px] text-lg border-2 border-slate-300 focus:border-teal-500 rounded-xl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToStep(4)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  Review Order
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Review your order</h2>
                <p className="text-lg text-slate-600">Please review all details before confirming your order</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-t-lg">
                    <CardTitle className="text-xl font-bold flex items-center">
                      <Package className="w-6 h-6 mr-2" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {selectedServices.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <span className="font-medium text-slate-700">
                            {item.service} × {item.quantity}
                          </span>
                          <span className="font-bold text-blue-600">
                            ₵{item.price > 0 ? item.price * item.quantity : "TBD"}
                          </span>
                        </div>
                      ))}

                      <div className="border-t border-slate-200 pt-4">
                        <div className="flex justify-between text-lg mb-2">
                          <span className="text-slate-600">Estimated Subtotal</span>
                          <span className="font-semibold">₵{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-lg mb-3">
                          <span className="text-slate-600">Pickup & Delivery</span>
                          <span className="font-semibold">₵{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-blue-600 border-t border-slate-200 pt-3">
                          <span>Estimated Total</span>
                          <span>₵{total}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Details Summary */}
                <div className="space-y-6">
                  {/* Pickup Details */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-emerald-50">
                      <CardTitle className="text-lg font-bold text-emerald-800 flex items-center">
                        <Truck className="w-5 h-5 mr-2" />
                        Pickup Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Date:</strong> {pickupDate}
                        </p>
                        <p>
                          <strong>Time:</strong> {pickupTime || "Any time"}
                        </p>
                        <p>
                          <strong>Location:</strong> {customerInfo.address}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Details */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-purple-50">
                      <CardTitle className="text-lg font-bold text-purple-800 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Contact Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Name:</strong> {customerInfo.name}
                        </p>
                        <p>
                          <strong>Phone:</strong> {customerInfo.phone}
                        </p>
                        {customerInfo.email && (
                          <p>
                            <strong>Email:</strong> {customerInfo.email}
                          </p>
                        )}
                        {customerInfo.instructions && (
                          <p>
                            <strong>Instructions:</strong> {customerInfo.instructions}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Important Notice */}
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-6 h-6 text-yellow-600 mt-1" />
                    <div>
                      <h4 className="font-bold text-yellow-800 mb-2">Final Pricing Confirmation</h4>
                      <p className="text-yellow-700">
                        The prices shown are estimates to help you plan. Our team will assess your actual items at
                        pickup and confirm the final pricing before we start cleaning. You'll only pay for what we
                        actually process.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Submitting Order...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6 mr-3" />
                      Confirm Order - Est. ₵{total}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
