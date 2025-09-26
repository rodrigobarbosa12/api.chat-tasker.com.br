import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { FeatureFlagService } from 'src/applications/feature-flag/featureFlag.service'
import { TasksService } from 'src/applications/tasks/tasks.service'
import { TasksController } from 'src/interfaces/tasks.controller'

describe('TasksController', () => {
  let controller: TasksController
  let service: TasksService

  const mockTask = { id: 1, title: 'Test', description: 'Desc', status: 'open' }

  const mockTasksService = {
    findAll: jest.fn().mockResolvedValue([mockTask]),
    findOne: jest.fn().mockResolvedValue(mockTask),
    createTask: jest.fn().mockResolvedValue({ text: 'ok' }),
    updateTask: jest.fn().mockResolvedValue(undefined),
  }

  const mockFeatureFlagService = {
    isEnabled: jest.fn().mockReturnValue(true),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
      ],
    }).compile()

    controller = module.get<TasksController>(TasksController)
    service = module.get<TasksService>(TasksService)
  })

  it('deve retornar todas as tarefas (findAll)', async () => {
    const query = { search: 'Parto', limit: 5 }
    const req = { session: { userId: 42 } } as unknown as Request

    const result = await controller.findAll(query, req)

    expect(service.findAll).toHaveBeenCalledWith(42, 'Parto', 5)
    expect(result).toEqual([mockTask])
  })

  it('deve retornar uma tarefa específica (findOne)', async () => {
    const result = await controller.findOne('1')

    expect(service.findOne).toHaveBeenCalledWith(1)
    expect(result).toEqual(mockTask)
  })

  it('deve criar uma nova tarefa (create)', async () => {
    const req = { session: { userId: 123 } } as unknown as Request
    const body = { text: 'Nova tarefa' }

    const result = await controller.create(body, req)

    expect(service.createTask).toHaveBeenCalledWith('Nova tarefa', 123)
    expect(result).toEqual({ text: 'ok' })
  })

  it('deve atualizar uma tarefa existente (update)', async () => {
    const body = { text: 'Atualizar tarefa' }

    const result = await controller.update(1, body)

    expect(service.updateTask).toHaveBeenCalledWith(1, 'Atualizar tarefa', 1)
    expect(result).toBeUndefined() // garante cobertura de return void
  })
})
