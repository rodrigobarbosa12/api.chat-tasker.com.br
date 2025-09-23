import { AiCacheService } from 'src/applications/ai/ai.cache.service'

jest.mock('ioredis', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      get: jest.fn(),
      set: jest.fn(),
    })),
  }
})

describe('AiCacheService', () => {
  let service: AiCacheService
  let redisMock: any

  beforeEach(() => {
    service = new AiCacheService()
    redisMock = (service as any).redis
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return null if key does not exist', async () => {
    redisMock.get.mockResolvedValue(null)
    const result = await service.get('nonexistent-key')
    expect(result).toBeNull()
    expect(redisMock.get).toHaveBeenCalledWith('nonexistent-key')
  })

  it('should return parsed value if key exists', async () => {
    const value = { title: 'Test', description: 'Desc' }
    redisMock.get.mockResolvedValue(JSON.stringify(value))

    const result = await service.get('existing-key')
    expect(result).toEqual(value)
    expect(redisMock.get).toHaveBeenCalledWith('existing-key')
  })

  it('should set value with default TTL', async () => {
    const value = { title: 'Test', description: 'Desc' }
    await service.set('key', value)

    expect(redisMock.set).toHaveBeenCalledWith(
      'key',
      JSON.stringify(value),
      'EX',
      600,
    )
  })

  it('should set value with custom TTL', async () => {
    const value = { title: 'Test', description: 'Desc' }
    await service.set('key', value, 120)

    expect(redisMock.set).toHaveBeenCalledWith(
      'key',
      JSON.stringify(value),
      'EX',
      120,
    )
  })
})
