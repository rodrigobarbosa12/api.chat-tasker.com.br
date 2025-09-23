import { Test, TestingModule } from '@nestjs/testing'
import { AiService } from 'src/applications/ai/ai.service'
import { TasksService } from 'src/applications/tasks/tasks.service'
import { Task } from 'src/infrastructure/database/typeorm/entity/Task'

describe('TasksService', () => {
  let service: TasksService
  let aiService: AiService

  const mockRepo = {
    create: jest.fn((t) => t),
    save: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      setParameter: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest
        .fn()
        .mockResolvedValue([
          { id: 1, title: 't', description: 'd', priority: 'high' },
        ]),
      getRawAndEntities: jest.fn().mockResolvedValue({
        entities: [{ id: 1, title: 't', description: 'd' }],
        raw: [{ distance: 0.5 }],
      }),
      orderBy: jest.fn().mockReturnThis(),
    })),
    findOne: jest.fn().mockResolvedValue({ id: 1, title: 't' }),
  }

  const mockAiService = {
    summarize: jest.fn(),
    prioritize: jest.fn(),
    embed: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: 'TASK_REPOSITORY', useValue: mockRepo },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile()

    service = module.get<TasksService>(TasksService)
    aiService = module.get<AiService>(AiService)
  })

  it('should createTask', async () => {
    mockAiService.summarize.mockResolvedValue({ title: 't', description: 'd' })
    mockAiService.prioritize.mockResolvedValue({
      priorityLevel: 'high',
      priorityScore: 1,
      explain: 'e',
    })
    mockAiService.embed.mockResolvedValue([0.1, 0.2])

    await service.createTask('text', 1)
    expect(mockRepo.save).toHaveBeenCalled()
  })

  it('should updateTask', async () => {
    mockAiService.summarize.mockResolvedValue({ title: 't', description: 'd' })
    mockAiService.prioritize.mockResolvedValue({
      priorityLevel: 'high',
      priorityScore: 1,
      explain: 'e',
    })
    mockAiService.embed.mockResolvedValue([0.1, 0.2])
    mockRepo.findOneBy.mockResolvedValue({ id: 1 })

    await service.updateTask(1, 'text', 1)
    expect(mockRepo.update).toHaveBeenCalled()
  })

  it('should findAll without search', async () => {
    const result = await service.findAll(undefined, 10)
    expect(result).toHaveLength(1)
    expect(mockRepo.createQueryBuilder).toHaveBeenCalled()
  })

  it('should findAll with search', async () => {
    mockAiService.embed.mockResolvedValue([0.1, 0.2])
    const result = (await service.findAll('busca', 10)) as (Task & {
      distance: number
    })[]
    expect(result[0].distance).toBe(0.5)
    expect(mockRepo.createQueryBuilder).toHaveBeenCalled()
  })

  it('should findOne', async () => {
    const task = await service.findOne(1)
    expect(task.id).toBe(1)
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
  })
})
