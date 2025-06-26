import redis from "./redis"

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress: string
  instructions?: string
  services: Array<{
    service: string
    quantity: number
    price: number
  }>
  pickupDate: string
  pickupTime?: string
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export enum OrderStatus {
  CONFIRMED = "CONFIRMED",
  PICKED_UP = "PICKED_UP",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

// Redis key patterns
const KEYS = {
  ORDER: (id: string) => `order:${id}`,
  ORDER_BY_NUMBER: (orderNumber: string) => `order_number:${orderNumber}`,
  ORDERS_BY_DATE: (date: string) => `orders_date:${date}`,
  ORDERS_BY_STATUS: (status: string) => `orders_status:${status}`,
  ORDER_COUNTER: "order_counter",
  ALL_ORDERS: "all_orders",
}

export class RedisOrderService {
  // Create a new order
  static async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    try {
      // Generate unique ID
      const id = await redis.incr(KEYS.ORDER_COUNTER)
      const orderId = `order_${id.toString().padStart(8, "0")}`

      const now = new Date().toISOString()
      const order: Order = {
        ...orderData,
        id: orderId,
        createdAt: now,
        updatedAt: now,
      }

      // Use Redis pipeline for atomic operations
      const pipeline = redis.pipeline()

      // Store order by ID
      pipeline.hset(KEYS.ORDER(orderId), {
        data: JSON.stringify(order),
      })

      // Store order number mapping
      pipeline.set(KEYS.ORDER_BY_NUMBER(order.orderNumber), orderId)

      // Add to date index
      pipeline.sadd(KEYS.ORDERS_BY_DATE(order.pickupDate), orderId)

      // Add to status index
      pipeline.sadd(KEYS.ORDERS_BY_STATUS(order.status), orderId)

      // Add to all orders set
      pipeline.zadd(KEYS.ALL_ORDERS, Date.now(), orderId)

      // Set expiration for date and status indexes (30 days)
      const expireTime = 30 * 24 * 60 * 60 // 30 days in seconds
      pipeline.expire(KEYS.ORDERS_BY_DATE(order.pickupDate), expireTime)
      pipeline.expire(KEYS.ORDERS_BY_STATUS(order.status), expireTime)

      await pipeline.exec()

      console.log(`✅ Order created: ${orderId}`)
      return order
    } catch (error) {
      console.error("❌ Error creating order:", error)
      throw new Error("Failed to create order")
    }
  }

  // Get order by ID
  static async getOrderById(id: string): Promise<Order | null> {
    try {
      const orderData = await redis.hget(KEYS.ORDER(id), "data")
      if (!orderData) return null

      return JSON.parse(orderData) as Order
    } catch (error) {
      console.error("❌ Error getting order by ID:", error)
      return null
    }
  }

  // Get order by order number
  static async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      const orderId = await redis.get(KEYS.ORDER_BY_NUMBER(orderNumber))
      if (!orderId) return null

      return await this.getOrderById(orderId)
    } catch (error) {
      console.error("❌ Error getting order by number:", error)
      return null
    }
  }

  // Update order status
  static async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    try {
      const order = await this.getOrderById(id)
      if (!order) return null

      const oldStatus = order.status
      const updatedOrder: Order = {
        ...order,
        status,
        updatedAt: new Date().toISOString(),
      }

      const pipeline = redis.pipeline()

      // Update order data
      pipeline.hset(KEYS.ORDER(id), {
        data: JSON.stringify(updatedOrder),
      })

      // Update status indexes
      pipeline.srem(KEYS.ORDERS_BY_STATUS(oldStatus), id)
      pipeline.sadd(KEYS.ORDERS_BY_STATUS(status), id)

      await pipeline.exec()

      console.log(`✅ Order ${id} status updated: ${oldStatus} → ${status}`)
      return updatedOrder
    } catch (error) {
      console.error("❌ Error updating order status:", error)
      throw new Error("Failed to update order status")
    }
  }

  // Get orders with filters
  static async getOrders(
    filters: {
      date?: string
      status?: OrderStatus
      limit?: number
      offset?: number
    } = {},
  ): Promise<Order[]> {
    try {
      let orderIds: string[] = []

      if (filters.date && filters.status) {
        // Get intersection of date and status
        const tempKey = `temp:${Date.now()}`
        await redis.sinterstore(tempKey, KEYS.ORDERS_BY_DATE(filters.date), KEYS.ORDERS_BY_STATUS(filters.status))
        orderIds = await redis.smembers(tempKey)
        await redis.del(tempKey)
      } else if (filters.date) {
        orderIds = await redis.smembers(KEYS.ORDERS_BY_DATE(filters.date))
      } else if (filters.status) {
        orderIds = await redis.smembers(KEYS.ORDERS_BY_STATUS(filters.status))
      } else {
        // Get all orders (sorted by creation time, newest first)
        const limit = filters.limit || 50
        const offset = filters.offset || 0
        orderIds = await redis.zrevrange(KEYS.ALL_ORDERS, offset, offset + limit - 1)
      }

      if (orderIds.length === 0) return []

      // Get order data in batch
      const pipeline = redis.pipeline()
      orderIds.forEach((id) => {
        pipeline.hget(KEYS.ORDER(id), "data")
      })

      const results = await pipeline.exec()
      const orders: Order[] = []

      results?.forEach((result, index) => {
        if (result && result[1]) {
          try {
            const order = JSON.parse(result[1] as string) as Order
            orders.push(order)
          } catch (error) {
            console.error(`❌ Error parsing order ${orderIds[index]}:`, error)
          }
        }
      })

      // Sort by creation date (newest first)
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      return orders
    } catch (error) {
      console.error("❌ Error getting orders:", error)
      return []
    }
  }

  // Get order statistics
  static async getOrderStats(): Promise<{
    total: number
    byStatus: Record<string, number>
    todayTotal: number
    todayRevenue: number
  }> {
    try {
      const today = new Date().toISOString().split("T")[0]

      const pipeline = redis.pipeline()
      pipeline.zcard(KEYS.ALL_ORDERS)
      pipeline.scard(KEYS.ORDERS_BY_DATE(today))

      // Get counts by status
      Object.values(OrderStatus).forEach((status) => {
        pipeline.scard(KEYS.ORDERS_BY_STATUS(status))
      })

      const results = await pipeline.exec()

      const total = (results?.[0]?.[1] as number) || 0
      const todayTotal = (results?.[1]?.[1] as number) || 0

      const byStatus: Record<string, number> = {}
      Object.values(OrderStatus).forEach((status, index) => {
        byStatus[status] = (results?.[index + 2]?.[1] as number) || 0
      })

      // Calculate today's revenue
      const todayOrders = await this.getOrders({ date: today })
      const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0)

      return {
        total,
        byStatus,
        todayTotal,
        todayRevenue,
      }
    } catch (error) {
      console.error("❌ Error getting order stats:", error)
      return {
        total: 0,
        byStatus: {},
        todayTotal: 0,
        todayRevenue: 0,
      }
    }
  }

  // Delete order (soft delete by moving to archived status)
  static async deleteOrder(id: string): Promise<boolean> {
    try {
      const order = await this.getOrderById(id)
      if (!order) return false

      const pipeline = redis.pipeline()

      // Remove from all indexes
      pipeline.srem(KEYS.ORDERS_BY_DATE(order.pickupDate), id)
      pipeline.srem(KEYS.ORDERS_BY_STATUS(order.status), id)
      pipeline.zrem(KEYS.ALL_ORDERS, id)

      // Delete order data
      pipeline.del(KEYS.ORDER(id))
      pipeline.del(KEYS.ORDER_BY_NUMBER(order.orderNumber))

      await pipeline.exec()

      console.log(`✅ Order deleted: ${id}`)
      return true
    } catch (error) {
      console.error("❌ Error deleting order:", error)
      return false
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const result = await redis.ping()
      return result === "PONG"
    } catch (error) {
      console.error("❌ Redis health check failed:", error)
      return false
    }
  }
}
