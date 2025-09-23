import { FeatureFlagService } from 'src/applications/feature-flag/featureFlag.service'

jest.mock('ioredis', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      get: jest.fn(),
      sadd: jest.fn(),
      srem: jest.fn(),
      sismember: jest.fn(),
    })),
  }
})

describe('FeatureFlagService', () => {
  let service: FeatureFlagService
  let redisMock: any

  beforeEach(() => {
    service = new FeatureFlagService()
    redisMock = (service as any).redis
  })

  it('should enable and disable feature globally', async () => {
    await service.enableFeature('findAll')
    expect(redisMock.set).toHaveBeenCalledWith('feature:findAll:global', 'true')

    await service.disableFeature('findAll')
    expect(redisMock.set).toHaveBeenCalledWith(
      'feature:findAll:global',
      'false',
    )
  })

  it('should enable and disable feature for a user', async () => {
    await service.enableFeature('findAll', 1)
    expect(redisMock.sadd).toHaveBeenCalledWith('feature:findAll:users', 1)

    await service.disableFeature('findAll', 1)
    expect(redisMock.srem).toHaveBeenCalledWith('feature:findAll:users', 1)
  })

  it('should return true if global flag is enabled', async () => {
    redisMock.get.mockResolvedValue('true')
    const result = await service.isEnabled('findAll')
    expect(result).toBe(true)
  })

  it('should return true if user flag is enabled', async () => {
    redisMock.get.mockResolvedValue(null)
    redisMock.sismember.mockResolvedValue(1)
    const result = await service.isEnabled('findAll', '1')
    expect(result).toBe(true)
  })

  it('should return false if no flags are enabled', async () => {
    redisMock.get.mockResolvedValue('false')
    redisMock.sismember.mockResolvedValue(0)
    const result = await service.isEnabled('findAll', '1')
    expect(result).toBe(false)
  })
})
