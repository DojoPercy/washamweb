import { type NextRequest, NextResponse } from "next/server"
import { RedisOrderService } from "@/lib/redis-operations"

export async function GET(request: NextRequest) {
  try {
    const stats = await RedisOrderService.getOrderStats()
    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
