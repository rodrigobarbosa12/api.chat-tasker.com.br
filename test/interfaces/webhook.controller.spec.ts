import { Test, TestingModule } from '@nestjs/testing'
import { WebhookService } from 'src/applications/webhook/webhook.service'
import { WebhookController } from 'src/interfaces/webhook.controller'

describe('WebhookController', () => {
  let controller: WebhookController
  let service: WebhookService

  const mockWebhookService = {
    handleMessage: jest.fn().mockResolvedValue({ success: true }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [{ provide: WebhookService, useValue: mockWebhookService }],
    }).compile()

    controller = module.get<WebhookController>(WebhookController)
    service = module.get<WebhookService>(WebhookService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('deve chamar handleMessage e retornar resultado', async () => {
    const body = { text: 'Criar nova tarefa', userId: 1 }

    const result = await controller.receiveMessage(body)

    expect(service.handleMessage).toHaveBeenCalledWith('Criar nova tarefa', 1)
    expect(result).toEqual({ success: true })
  })
})
