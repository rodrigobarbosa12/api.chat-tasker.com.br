import { Test, TestingModule } from '@nestjs/testing'
import { TasksService } from 'src/applications/tasks/tasks.service'
import { WebhookService } from 'src/applications/webhook/webhook.service'

describe('WebhookService', () => {
  let service: WebhookService
  const mockTasksService = { createTask: jest.fn() }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: TasksService, useValue: mockTasksService },
      ],
    }).compile()

    service = module.get<WebhookService>(WebhookService)
  })

  it('should call tasks.createTask', async () => {
    await service.handleMessage('text', 1)
    expect(mockTasksService.createTask).toHaveBeenCalledWith('text', 1)
  })
})
