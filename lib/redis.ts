import { Redis } from "ioredis"

declare global {
  var redis: Redis | undefined
}

class RedisClient {
  private static instance: Redis

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number.parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
        lazyConnect: true,
        // Connection pool settings
        family: 4,
        keepAlive: true,
        connectTimeout: 10000,
        commandTimeout: 5000,
      })

      // Handle connection events
      RedisClient.instance.on("connect", () => {
        console.log("✅ Redis connected successfully")
      })

      RedisClient.instance.on("error", (error) => {
        console.error("❌ Redis connection error:", error)
      })

      RedisClient.instance.on("ready", () => {
        console.log("🚀 Redis is ready to accept commands")
      })

      RedisClient.instance.on("close", () => {
        console.log("🔌 Redis connection closed")
      })

      RedisClient.instance.on("reconnecting", () => {
        console.log("🔄 Redis reconnecting...")
      })
    }

    return RedisClient.instance
  }

  public static async disconnect(): Promise<void> {
    if (RedisClient.instance) {
      await RedisClient.instance.quit()
      RedisClient.instance = null as any
    }
  }
}

// Singleton Redis instance
const redisInstance = RedisClient.getInstance()

// Development hot reload protection
if (process.env.NODE_ENV !== "production") {
  if (!global.redis) {
    global.redis = redisInstance
  }
}

export default redisInstance
