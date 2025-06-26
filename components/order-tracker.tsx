"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Package, Clock, CheckCircle, Truck } from "lucide-react"

interface Order {
  orderNumber: string
  services: Array<{ service: string; quantity: number; price: number }>
  pickup: { date: string; time: string }
  customer: { name: string; phone: string; address: string }
  total: number
  status: string
  createdAt: string
}

export function OrderTracker() {
  const [orderNumber, setOrderNumber] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState("")

  const trackOrder = async () => {
    if (!orderNumber.trim()) {
      setError("Please enter an order number")
      return
    }

    try {
      const response = await fetch(`/api/orders/track/${orderNumber.trim()}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.order)
        setError("")
      } else {
        setOrder(null)
        setError("Order not found. Please check your order number.")
      }
    } catch (error) {
      console.error("Error tracking order:", error)
      setOrder(null)
      setError("Failed to track order. Please try again.")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "picked_up":
        return <Package className="w-5 h-5 text-blue-600" />
      case "in_progress":
        return <Clock className="w-5 h-5 text-amber-600" />
      case "ready":
        return <Truck className="w-5 h-5 text-purple-600" />
      default:
        return <Clock className="w-5 h-5 text-slate-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Order Confirmed - Awaiting Pickup"
      case "picked_up":
        return "Items Picked Up - Processing"
      case "in_progress":
        return "Cleaning in Progress"
      case "ready":
        return "Ready for Delivery"
      default:
        return "Unknown Status"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-slate-800">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <span>Track Your Order</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div>
          <Label htmlFor="order-number" className="text-slate-700 font-medium">
            Order Number
          </Label>
          <div className="flex space-x-2 mt-2">
            <Input
              id="order-number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number (e.g., WA123456789)"
              className="flex-1 border-2 border-blue-200 focus:border-blue-500 rounded-xl"
            />
            <Button
              onClick={trackOrder}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-xl px-6"
            >
              Track
            </Button>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">{error}</div>}

        {order && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-xl border-2 border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                {getStatusIcon(order.status)}
                <span className="font-semibold text-slate-800">{getStatusText(order.status)}</span>
              </div>
              <p className="text-sm text-slate-600">Order #{order.orderNumber}</p>
              <p className="text-sm text-slate-600">
                Pickup: {order.pickup.date} {order.pickup.time && `(${order.pickup.time})`}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Services</h4>
              <div className="space-y-1">
                {order.services.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {item.service} × {item.quantity}
                    </span>
                    <span className="font-medium text-slate-800">
                      ₵{item.price > 0 ? item.price * item.quantity : "TBD"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-semibold text-slate-800">
                <span>Total</span>
                <span>₵{order.total}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Contact</h4>
              <p className="text-sm text-slate-600">{order.customer.name}</p>
              <p className="text-sm text-slate-600">{order.customer.phone}</p>
              <p className="text-sm text-slate-600">{order.customer.address}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
