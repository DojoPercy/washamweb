"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Shield, Package, Clock, CheckCircle, Truck, X, Filter, RefreshCw, Eye } from "lucide-react"
import Image from "next/image"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress: string
  instructions?: string
  services: any[]
  pickupDate: string
  pickupTime?: string
  subtotal: number
  deliveryFee: number
  total: number
  status: string
  createdAt: string
  updatedAt: string
}

const statusColors = {
  CONFIRMED: "bg-blue-100 text-blue-800",
  PICKED_UP: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  READY: "bg-green-100 text-green-800",
  DELIVERED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const statusIcons = {
  CONFIRMED: CheckCircle,
  PICKED_UP: Package,
  IN_PROGRESS: Clock,
  READY: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: X,
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessKey, setAccessKey] = useState("")
  const [authError, setAuthError] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  const authenticate = async () => {
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        setAuthError("")
        fetchOrders()
      } else {
        setAuthError("Invalid access key")
      }
    } catch (error) {
      setAuthError("Authentication failed")
    }
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedDate) params.append("date", selectedDate)
      if (statusFilter !== "ALL") params.append("status", statusFilter)

      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      }
    } catch (error) {
      console.error("Failed to update order status:", error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
      fetchStats()
    }
  }, [selectedDate, statusFilter, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Admin Access</CardTitle>
            <p className="text-slate-600">Enter access key to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="accessKey">Access Key</Label>
              <Input
                id="accessKey"
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter access key"
                onKeyPress={(e) => e.key === "Enter" && authenticate()}
              />
            </div>
            {authError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{authError}</div>}
            <Button onClick={authenticate} className="w-full">
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/washam-logo.png" alt="WashAm Logo" width={40} height={40} className="rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-slate-800">WashAm Admin</h1>
                <p className="text-sm text-slate-600">Order Management System</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters & Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="date-filter">Pickup Date</Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status-filter">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Orders</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="READY">Ready</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={fetchOrders} disabled={loading} className="w-full">
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
              <div className="flex items-end">
                <div className="text-sm text-slate-600">
                  <p className="font-medium">Total Orders: {stats?.total || orders.length}</p>
                  <p>Today's Revenue: ₵{stats?.todayRevenue || orders.reduce((sum, order) => sum + order.total, 0)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <p className="text-sm text-slate-600">{order.customerName}</p>
                    </div>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {order.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Phone</p>
                      <p className="font-medium">{order.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Total</p>
                      <p className="font-bold text-green-600">₵{order.total}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Pickup Date</p>
                      <p className="font-medium">{order.pickupDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Services</p>
                      <p className="font-medium">{order.services.length} items</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex space-x-2 mb-3">
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)} className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600">Update Status</Label>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                        disabled={updatingStatus === order.id}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="READY">Ready</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Orders Found</h3>
            <p className="text-slate-500">No orders match your current filters.</p>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Details - {selectedOrder.orderNumber}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-slate-600">Name:</span> {selectedOrder.customerName}
                      </p>
                      <p>
                        <span className="text-slate-600">Phone:</span> {selectedOrder.customerPhone}
                      </p>
                      {selectedOrder.customerEmail && (
                        <p>
                          <span className="text-slate-600">Email:</span> {selectedOrder.customerEmail}
                        </p>
                      )}
                      <p>
                        <span className="text-slate-600">Address:</span> {selectedOrder.customerAddress}
                      </p>
                      {selectedOrder.instructions && (
                        <p>
                          <span className="text-slate-600">Instructions:</span> {selectedOrder.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-slate-600">Pickup Date:</span> {selectedOrder.pickupDate}
                      </p>
                      <p>
                        <span className="text-slate-600">Pickup Time:</span> {selectedOrder.pickupTime || "Any time"}
                      </p>
                      <p>
                        <span className="text-slate-600">Status:</span>
                        <Badge className={`ml-2 ${statusColors[selectedOrder.status as keyof typeof statusColors]}`}>
                          {selectedOrder.status.replace("_", " ")}
                        </Badge>
                      </p>
                      <p>
                        <span className="text-slate-600">Created:</span>{" "}
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Services</h4>
                  <div className="space-y-2">
                    {selectedOrder.services.map((service: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span>
                          {service.service} × {service.quantity}
                        </span>
                        <span className="font-medium">₵{service.price * service.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subtotal:</span>
                      <span>₵{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Delivery Fee:</span>
                      <span>₵{selectedOrder.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>₵{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
