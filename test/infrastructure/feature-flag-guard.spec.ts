import { ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { FeatureFlagService } from 'src/applications/feature-flag/featureFlag.service'
import { FeatureFlagGuard } from 'src/infrastructure/guards/FeatureFlagGuard'
import * as utils from 'src/infrastructure/utils'

describe('FeatureFlagGuard', () => {
  let guard: FeatureFlagGuard
  let reflector: Reflector
  let featureFlagService: FeatureFlagService

  const mockFeatureFlagService = {
    isEnabled: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureFlagGuard,
        Reflector,
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
      ],
    }).compile()

    guard = module.get<FeatureFlagGuard>(FeatureFlagGuard)
    reflector = module.get<Reflector>(Reflector)
    featureFlagService = module.get<FeatureFlagService>(FeatureFlagService)
  })

  it('deve permitir quando não há feature definida', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined)

    const req: any = { headers: { authorization: 'Bearer token123' } }
    const context = {
      switchToHttp: () => ({ getRequest: () => req }),
      getHandler: () => ({}),
    } as any

    await expect(guard.canActivate(context)).resolves.toBe(true)
  })

  it('deve permitir se a feature estiver habilitada', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue('findAll')
    jest.spyOn(utils, 'getPayload').mockReturnValue({
      payload: { user: { id: 1 } },
    } as any)
    mockFeatureFlagService.isEnabled.mockResolvedValue(true)

    const req: any = { headers: { authorization: 'Bearer token123' } }
    const context = {
      switchToHttp: () => ({ getRequest: () => req }),
      getHandler: () => ({}),
    } as any

    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect(mockFeatureFlagService.isEnabled).toHaveBeenCalledWith('findAll', 1)
  })

  it('deve lançar ForbiddenException se a feature estiver desabilitada', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue('findAll')
    jest.spyOn(utils, 'getPayload').mockReturnValue({
      payload: { user: { id: 1 } },
    } as any)
    mockFeatureFlagService.isEnabled.mockResolvedValue(false)

    const req: any = { headers: { authorization: 'Bearer token123' } }
    const context = {
      switchToHttp: () => ({ getRequest: () => req }),
      getHandler: () => ({}),
    } as any

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException)
  })
})
