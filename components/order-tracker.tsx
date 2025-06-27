"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Package, Clock, CheckCircle, Truck, Calendar } from "lucide-react" // Added Calendar icon



export function OrderTracker() {
  const [orderNumber, setOrderNumber] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState("")
  const [isRescheduling, setIsRescheduling] = useState(false) // State for reschedule button loading

  const trackOrder = async () => {
    if (!orderNumber.trim()) {
      setError("Please enter an order number")
      setOrder(null) // Clear previous order details
      return
    }

    setError("") // Clear previous errors
    setOrder(null) // Clear previous order details

    try {
      const response = await fetch(`/api/orders/track/${orderNumber.trim()}`)
      const data = await response.json()
        console.log(data)
      if (response.ok && data.success) { // Check response.ok for successful HTTP status
        setOrder(data.order)
      } else {
        setError(data.message || "Order not found. Please check your order number.")
        setOrder(null)
      }
    } catch (error) {
      console.error("Error tracking order:", error)
      setError("Failed to track order. Please try again.")
      setOrder(null)
    }
  }

  // Placeholder for reschedule logic
  const handleRescheduleOrder = async () => {
    setIsRescheduling(true)
    // In a real application, you would:
    // 1. Open a modal or navigate to a reschedule page
    // 2. Pass the order.orderNumber to the rescheduling component/API
    // 3. Handle the rescheduling logic (e.g., API call to update pickup date/time)
    console.log(`Attempting to reschedule order: ${order?.orderNumber}`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    alert(`Reschedule functionality for order ${order?.orderNumber} would be implemented here.`);
    setIsRescheduling(false)
  }

  const getStatusIcon = (status: string) => {
    console.log(status)
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "PICKED_UP":
        return <Package className="w-5 h-5 text-blue-600" />
      case "IN_PROGRESS":
        return <Clock className="w-5 h-5 text-amber-600" />
      case "READY":
        return <Truck className="w-5 h-5 text-purple-600" />
      case "CANCELLED":
        return <Clock className="w-5 h-5 text-red-600" />
      case "DELIVERED":
        return <CheckCircle className="w-5 h-5 text-green-600" />
    
      case "RETURNED":
        return <Clock className="w-5 h-5 text-gray-600" />
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-teal-600" />
      case "FAILED":
        return <Clock className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-slate-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Order Confirmed - Awaiting Pickup"
      case "PICKED_UP":
        return "Items Picked Up - Processing"
      case "IN_PROGRESS":
        return "Cleaning in Progress"
      case "CANCELLED":
        return "Order Cancelled"
      case "DELIVERED":
        return "Order Delivered"    
      case "RETURNED":
        return "Order Returned"
      case "COMPLETED":
        return "Order Completed"
      case "FAILED":  
        return "Order Failed"
      case "READY":
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
            
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Services</h4>
              <div className="space-y-1">
                {order.services.map((item: any, index: any) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {item.service} × {item.quantity}
                    </span>
                    <span className="font-medium text-slate-800">
                      ₵{item.price > 0 ? (item.price * item.quantity).toFixed(2) : "TBD"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-semibold text-slate-800">
                <span>Total</span>
                <span>₵{order.total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Contact</h4>
              <p className="text-sm text-slate-600">{order.customer.name}</p>
              <p className="text-sm text-slate-600">{order.customer.phone}</p>
              <p className="text-sm text-slate-600">{order.customer.address}</p>
            </div>

            {/* Reschedule Order Button */}
            
          </div>
        )}
      </CardContent>
    </Card>
  )
}