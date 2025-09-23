import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { FeatureFlagService } from 'src/applications/feature-flag/featureFlag.service'
import { ToggleFeatureBody } from 'src/infrastructure/dtos/admin'
import { AdminController } from 'src/interfaces/admin.controller'

describe('AdminController', () => {
  let controller: AdminController
  let featureFlagService: FeatureFlagService

  const mockFeatureFlagService = {
    enableFeature: jest.fn().mockResolvedValue(undefined),
    disableFeature: jest.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
      ],
    }).compile()

    controller = module.get<AdminController>(AdminController)
    featureFlagService = module.get<FeatureFlagService>(FeatureFlagService)
  })

  it('deve lançar UnauthorizedException se usuário não for admin', async () => {
    const req = { session: { accessRole: 'user' } } as unknown as Request
    const body: ToggleFeatureBody = {
      enable: true,
      feature: 'findAll',
      usersId: 1,
    }

    await expect(controller.toggleFeature(body, req)).rejects.toThrow(
      UnauthorizedException,
    )
  })

  it('deve chamar enableFeature quando enable = true', async () => {
    const req = { session: { accessRole: 'admin' } } as unknown as Request
    const body: ToggleFeatureBody = {
      enable: true,
      feature: 'findAll',
      usersId: 1,
    }

    await controller.toggleFeature(body, req)

    expect(featureFlagService.enableFeature).toHaveBeenCalledWith('findAll', 1)
    expect(featureFlagService.disableFeature).not.toHaveBeenCalled()
  })

  it('deve chamar disableFeature quando enable = false', async () => {
    const req = { session: { accessRole: 'admin' } } as unknown as Request
    const body: ToggleFeatureBody = {
      enable: false,
      feature: 'findAll',
      usersId: 1,
    }

    await controller.toggleFeature(body, req)

    expect(featureFlagService.disableFeature).toHaveBeenCalledWith('findAll', 1)
    expect(featureFlagService.enableFeature).not.toHaveBeenCalled()
  })
})
