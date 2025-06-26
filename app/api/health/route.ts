import { type NextRequest, NextResponse } from "next/server"
import { RedisOrderService } from "@/lib/redis-operations"

export async function GET(request: NextRequest) {
  try {
    const redisHealthy = await RedisOrderService.healthCheck()

    return NextResponse.json({
      success: true,
      status: "healthy",
      services: {
        redis: redisHealthy ? "connected" : "disconnected",
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        success: false,
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
