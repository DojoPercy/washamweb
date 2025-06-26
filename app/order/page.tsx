"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package, Shirt, AnvilIcon as Iron, CheckCircle, Copy, Plus, Minus } from "lucide-react"
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
    setCustomerInfo({
      name: "",
      phone: "",
      email: "",
      address: "",
      instructions: "",
    })
  }

  // Order Confirmation View
  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/washam-logo.png" alt="WashAm Logo" width={40} height={40} className="rounded-lg" />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Order Confirmed!</h1>
            <p className="text-slate-600">Your laundry pickup has been scheduled successfully.</p>
          </div>

          <Card className="mb-6 border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-center text-[#1e3a5f]">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <span className="text-sm text-slate-600">Order Number:</span>
                <span className="text-xl font-bold text-[#1e3a5f]">{orderNumber}</span>
                <Button variant="ghost" size="sm" onClick={copyOrderNumber} className="p-1 h-auto">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-[#1e3a5f] mb-2">Pickup Information</h4>
                  <p className="text-sm text-slate-600">Date: {pickupDate}</p>
                  <p className="text-sm text-slate-600">Time: {pickupTime || "Any time"}</p>
                  <p className="text-sm text-slate-600">Location: {customerInfo.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#1e3a5f] mb-2">Contact</h4>
                  <p className="text-sm text-slate-600">Name: {customerInfo.name}</p>
                  <p className="text-sm text-slate-600">Phone: {customerInfo.phone}</p>
                  {customerInfo.email && <p className="text-sm text-slate-600">Email: {customerInfo.email}</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#1e3a5f] mb-2">Services Requested</h4>
                <div className="space-y-1">
                  {selectedServices.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.service} × {item.quantity}
                      </span>
                      <span>Estimate: ₵{item.price > 0 ? item.price * item.quantity : "TBD"}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 mt-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Estimated Subtotal</span>
                    <span>₵{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pickup & Delivery</span>
                    <span>₵{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1e3a5f]">
                    <span>Estimated Total</span>
                    <span>₵{total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-100 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-[#1e3a5f] mb-2">What happens next?</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• We'll send you a confirmation SMS shortly</li>
              <li>• Our team will assess your items and confirm final pricing at pickup</li>
              <li>• We'll text you 30 minutes before pickup</li>
              <li>• Your clothes will be ready for return within 24-48 hours</li>
              <li>• You can track your order using the order number above</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={startNewOrder} className="flex-1 bg-[#1e3a5f] hover:bg-[#2d4a6b] text-white">
              Submit Another Order
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full border-[#1e3a5f] text-[#1e3a5f] hover:bg-blue-50">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Regular Order Form
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-slate-600 hover:text-[#1e3a5f]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <Image src="/washam-logo.png" alt="WashAm Logo" width={40} height={40} className="rounded-lg" />
              <h1 className="text-xl font-bold text-[#1e3a5f]">Schedule Your Order</h1>
            </div>
          </div>
          {selectedServices.length > 0 && (
            <div className="bg-[#1e3a5f] text-white px-3 py-1 rounded-full text-sm">
              {selectedServices.reduce((sum, item) => sum + item.quantity, 0)} items • Est. ₵{total}
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Important Notice */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-yellow-800 mb-2">📋 How This Works</h3>
          <p className="text-yellow-700 text-sm">
            Use this form to tell us about your order size and what you need cleaned. The prices shown are estimates to
            help you plan. We'll assess your actual items at pickup and confirm the final pricing before we start
            cleaning.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Contact Information */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center space-x-2 text-[#1e3a5f]">
                <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span>Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-[#1e3a5f] font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="border-2 border-blue-200 focus:border-[#1e3a5f]"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-[#1e3a5f] font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                    className="border-2 border-blue-200 focus:border-[#1e3a5f]"
                    placeholder="0XX XXX XXXX"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-[#1e3a5f] font-medium">
                  Email Address (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                  className="border-2 border-blue-200 focus:border-[#1e3a5f]"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
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
                <Label htmlFor="instructions" className="text-[#1e3a5f] font-medium">
                  Special Instructions (Optional)
                </Label>
                <Textarea
                  id="instructions"
                  value={customerInfo.instructions}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Building access, parking instructions, etc."
                  className="border-2 border-blue-200 focus:border-[#1e3a5f]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Pickup Schedule */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center space-x-2 text-[#1e3a5f]">
                <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span>When should we pick up?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="bg-blue-100 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-[#1e3a5f] font-medium">
                  📅 We pickup between 8AM - 10PM daily
                  <br />📱 You'll get a 30-minute heads up via SMS
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickup-date" className="text-[#1e3a5f] font-medium">
                    Pickup Date *
                  </Label>
                  <Input
                    id="pickup-date"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="border-2 border-blue-200 focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <Label htmlFor="pickup-time" className="text-[#1e3a5f] font-medium">
                    Preferred Time (Optional)
                  </Label>
                  <Select value={pickupTime} onValueChange={setPickupTime}>
                    <SelectTrigger className="border-2 border-blue-200 focus:border-[#1e3a5f]">
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
            </CardContent>
          </Card>

          {/* Step 3: Tell us about your order */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center space-x-2 text-[#1e3a5f]">
                <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span>Tell us about your order size</span>
              </CardTitle>
              <p className="text-sm text-slate-600 mt-2">
                Help us estimate your order by selecting approximate quantities. We'll confirm exact pricing at pickup.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Wash & Fold */}
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shirt className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1e3a5f] text-lg">Wash & Fold</h3>
                    <p className="text-sm text-slate-600">Clean, dry, and neatly folded</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {[
                    { name: "Small Bag (3kg)", price: 45, desc: "Perfect for 1-2 days of clothes" },
                    { name: "Medium Bag (5kg)", price: 80, desc: "Great for a week's worth" },
                    { name: "Large Bag (8kg)", price: 150, desc: "Family size or bulk items" },
                  ].map((item) => {
                    const selected = selectedServices.find((s) => s.service === `Wash & Fold - ${item.name}`)
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[#1e3a5f]">{item.name}</span>
                            <span className="font-bold text-[#1e3a5f]">~₵{item.price}</span>
                          </div>
                          <p className="text-xs text-slate-600">{item.desc}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {selected && (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(`Wash & Fold - ${item.name}`, selected.quantity - 1)}
                                className="w-8 h-8 p-0 border-[#1e3a5f] text-[#1e3a5f]"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-bold text-[#1e3a5f]">{selected.quantity}</span>
                            </>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => addService(`Wash & Fold - ${item.name}`, item.price)}
                            className="bg-[#1e3a5f] hover:bg-[#2d4a6b] text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Iron Service */}
              <div className="border-2 border-orange-200 rounded-lg p-4 bg-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Iron className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1e3a5f] text-lg">Iron Service</h3>
                    <p className="text-sm text-slate-600">Professional pressing for crisp clothes</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1e3a5f]">Approximate Items</span>
                      <span className="font-bold text-[#1e3a5f]">~₵5 each</span>
                    </div>
                    <p className="text-xs text-slate-600">Shirts, pants, dresses, etc.</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
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
                          className="w-8 h-8 p-0 border-[#1e3a5f] text-[#1e3a5f]"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-bold text-[#1e3a5f]">
                          {selectedServices.find((s) => s.service === "Iron Service")?.quantity}
                        </span>
                      </>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addService("Iron Service", 5)}
                      className="bg-[#1e3a5f] hover:bg-[#2d4a6b] text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sneaker Cleaning */}
              <div className="border-2 border-green-200 rounded-lg p-4 bg-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1e3a5f] text-lg">Sneaker Cleaning</h3>
                    <p className="text-sm text-slate-600">Deep clean and restore your sneakers</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1e3a5f]">Number of Pairs</span>
                      <span className="font-bold text-[#1e3a5f]">~₵15 each</span>
                    </div>
                    <p className="text-xs text-slate-600">Includes cleaning, deodorizing & laces</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
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
                          className="w-8 h-8 p-0 border-[#1e3a5f] text-[#1e3a5f]"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-bold text-[#1e3a5f]">
                          {selectedServices.find((s) => s.service === "Sneaker Cleaning")?.quantity}
                        </span>
                      </>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addService("Sneaker Cleaning", 15)}
                      className="bg-[#1e3a5f] hover:bg-[#2d4a6b] text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dry Cleaning */}
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1e3a5f] text-lg">Dry Cleaning</h3>
                    <p className="text-sm text-slate-600">For delicate and formal wear</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1e3a5f]">Approximate Items</span>
                      <span className="font-bold text-[#1e3a5f]">Priced at pickup</span>
                    </div>
                    <p className="text-xs text-slate-600">Suits, dresses, delicate fabrics</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
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
                          className="w-8 h-8 p-0 border-[#1e3a5f] text-[#1e3a5f]"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-bold text-[#1e3a5f]">
                          {selectedServices.find((s) => s.service === "Dry Cleaning")?.quantity}
                        </span>
                      </>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addService("Dry Cleaning", 0)}
                      className="bg-[#1e3a5f] hover:bg-[#2d4a6b] text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          {selectedServices.length > 0 && (
            <Card className="border-2 border-[#1e3a5f] bg-blue-50">
              <CardHeader className="bg-[#1e3a5f] text-white">
                <CardTitle>Estimated Order Summary</CardTitle>
                <p className="text-blue-100 text-sm">Final pricing will be confirmed at pickup</p>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                {selectedServices.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-[#1e3a5f]">
                      {item.service} × {item.quantity}
                    </span>
                    <span className="font-bold text-[#1e3a5f]">
                      ~₵{item.price > 0 ? item.price * item.quantity : "TBD"}
                    </span>
                  </div>
                ))}
                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-[#1e3a5f]">Estimated Subtotal</span>
                    <span className="text-[#1e3a5f]">₵{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1e3a5f]">Pickup & Delivery</span>
                    <span className="text-[#1e3a5f]">₵{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-[#1e3a5f] border-t border-blue-200 pt-2">
                    <span>Estimated Total</span>
                    <span>₵{total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              size="lg"
              className="bg-[#1e3a5f] hover:bg-[#2d4a6b] text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
              disabled={
                selectedServices.length === 0 ||
                !customerInfo.name ||
                !customerInfo.phone ||
                !customerInfo.address ||
                !pickupDate ||
                isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting Order...
                </>
              ) : selectedServices.length === 0 ? (
                "Select Services to Continue"
              ) : (
                `Schedule Pickup - Est. ₵${total}`
              )}
            </Button>
            <p className="text-sm text-slate-600 mt-4">
              💡 We'll assess your actual items at pickup and confirm final pricing before we start cleaning.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
