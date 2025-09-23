import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'

const { REDIS_HOST, REDIS_PORT } = process.env

@Injectable()
export class AiCacheService {
  private redis: Redis

  constructor() {
    this.redis = new Redis({
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
    })
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    return data ? (JSON.parse(data) as T) : null
  }

  async set<T>(key: string, value: T, ttlSeconds = 600): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  }
}
