import { type NextRequest, NextResponse } from "next/server"
import { RedisOrderService, OrderStatus } from "@/lib/redis-operations"
import { sendNewOrderNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    console.log(orderData.orderNumber, "Order data received")
    // Create order in Redis
    const order = await RedisOrderService.createOrder({
      orderNumber: orderData.orderNumber,
      customerName: orderData.customer.name,
      customerPhone: orderData.customer.phone,
      customerEmail: orderData.customer.email,
      customerAddress: orderData.customer.address,
      instructions: orderData.customer.instructions,
      services: orderData.services,
      pickupDate: orderData.pickup.date,
      pickupTime: orderData.pickup.time,
      subtotal: orderData.subtotal || 0,
      deliveryFee: orderData.deliveryFee || 5,
      total: orderData.total,
      status: OrderStatus.CONFIRMED,
    })

    console.log("Order created:", order)
    // Send email notification
    await sendNewOrderNotification({
      ...orderData,
      ...orderData.customer,
      ...orderData.pickup,
      createdAt: order.createdAt,
    })

    console.log("Notification email sent for order:", order.id)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
      },
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const status = searchParams.get("status") as OrderStatus
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const filters: any = { limit, offset }

    if (date) {
      filters.date = date
    }

    if (status && Object.values(OrderStatus).includes(status)) {
      filters.status = status
    }

    const orders = await RedisOrderService.getOrders(filters)

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}
