import { type NextRequest, NextResponse } from "next/server"
import { RedisOrderService } from "@/lib/redis-operations"

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const order = await RedisOrderService.getOrderByNumber(params.orderNumber)

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Return limited information for tracking
    const trackingInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      pickupDate: order.pickupDate,
      pickupTime: order.pickupTime,
      services: order.services,
      total: order.total,
      createdAt: order.createdAt,
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        address: order.customerAddress,
      },
    }

    return NextResponse.json({ success: true, order: trackingInfo })
  } catch (error) {
    console.error("Order tracking error:", error)
    return NextResponse.json({ success: false, error: "Failed to track order" }, { status: 500 })
  }
}
