import { Test, TestingModule } from '@nestjs/testing'
import { AiCacheService } from 'src/applications/ai/ai.cache.service'
import { AiService } from 'src/applications/ai/ai.service'

describe('AiService with Redis cache', () => {
  let service: AiService
  let cache: AiCacheService

  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService, { provide: AiCacheService, useValue: mockCache }],
    }).compile()

    service = module.get<AiService>(AiService)
    cache = module.get<AiCacheService>(AiCacheService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should summarize text and store in cache when no cache exists', async () => {
    mockCache.get.mockResolvedValue(null)

    // Mock do LLM
    jest
      .spyOn(service.llmOpenAILC, 'invoke')
      .mockResolvedValue(
        JSON.stringify({
          title: 'Resumo',
          description: 'Descrição resumida',
        }) as any,
      )

    const result = await service.summarize('texto qualquer')

    expect(result).toEqual({
      title: 'Resumo',
      description: 'Descrição resumida',
    })
    expect(mockCache.set).toHaveBeenCalled()
  })

  it('should return cached summarize result if cache exists', async () => {
    mockCache.get.mockResolvedValue({
      title: 'Cached',
      description: 'Cached desc',
    })

    const result = await service.summarize('texto qualquer')

    expect(result).toEqual({ title: 'Cached', description: 'Cached desc' })
    expect(mockCache.set).not.toHaveBeenCalled()
  })

  it('should prioritize task and store in cache when no cache exists', async () => {
    mockCache.get.mockResolvedValue(null)

    jest.spyOn(service.llmOpenAILC, 'invoke').mockResolvedValue(
      JSON.stringify({
        priorityLevel: 'high',
        priorityScore: 0.9,
        explain: 'Importante',
      }) as any,
    )

    const result = await service.prioritize({ title: 'T', description: 'D' })

    expect(result).toEqual({
      priorityLevel: 'high',
      priorityScore: 0.9,
      explain: 'Importante',
    })
    expect(mockCache.set).toHaveBeenCalled()
  })

  it('should return cached prioritize result if cache exists', async () => {
    mockCache.get.mockResolvedValue({
      priorityLevel: 'low',
      priorityScore: 0.1,
      explain: 'Cached',
    })

    const result = await service.prioritize({ title: 'T', description: 'D' })

    expect(result).toEqual({
      priorityLevel: 'low',
      priorityScore: 0.1,
      explain: 'Cached',
    })
    expect(mockCache.set).not.toHaveBeenCalled()
  })

  it('should embed text and store in cache when no cache exists', async () => {
    mockCache.get.mockResolvedValue(null)

    jest.spyOn(service.llmOpenAI.embeddings, 'create').mockResolvedValue({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    } as any)

    const result = await service.embed('texto qualquer')

    expect(result).toEqual([0.1, 0.2, 0.3])
    expect(mockCache.set).toHaveBeenCalled()
  })

  it('should return cached embedding if cache exists', async () => {
    mockCache.get.mockResolvedValue([0.5, 0.6, 0.7])

    const result = await service.embed('texto qualquer')

    expect(result).toEqual([0.5, 0.6, 0.7])
    expect(mockCache.set).not.toHaveBeenCalled()
  })
})
