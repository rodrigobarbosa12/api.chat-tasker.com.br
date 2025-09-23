import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'

const { REDIS_HOST, REDIS_PORT } = process.env

@Injectable()
export class FeatureFlagService {
  private redis: Redis

  constructor() {
    this.redis = new Redis({
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
    })
  }

  async isEnabled(feature: string, userId?: string): Promise<boolean> {
    const globalFlag = await this.redis.get(`feature:${feature}:global`)
    if (globalFlag === 'true') return true

    if (userId) {
      const userFlag = await this.redis.sismember(
        `feature:${feature}:users`,
        userId,
      )
      return userFlag === 1
    }

    return false
  }

  async enableFeature(feature: 'findAll' | 'findOne', userId?: number) {
    if (userId) {
      await this.redis.sadd(`feature:${feature}:users`, userId)
      return
    }

    await this.redis.set(`feature:${feature}:global`, 'true')
  }

  async disableFeature(feature: string, userId?: number) {
    if (userId) {
      await this.redis.srem(`feature:${feature}:users`, userId)
      return
    }

    await this.redis.set(`feature:${feature}:global`, 'false')
  }
}
