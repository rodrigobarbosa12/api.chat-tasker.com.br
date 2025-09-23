import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from 'src/applications/auth/auth.service'
import { AuthBodyCreate, AuthBodyLogin } from 'src/infrastructure/dtos/auth'
import { AuthController } from 'src/interfaces/auth.controller'

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn().mockResolvedValue({ token: 'fake-token' }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create (signup)', () => {
    it('should call AuthService.signup with correct data', async () => {
      const body: AuthBodyCreate = {
        name: 'Usuário do teste Jest',
        email: 'test@test.com',
        password: '123456',
        accessRole: 'default',
      }

      await controller.create(body)

      expect(service.signup).toHaveBeenCalledWith(body)
      expect(service.signup).toHaveBeenCalledTimes(1)
    })
  })

  describe('login (signin)', () => {
    it('should call AuthService.signin and return a token', async () => {
      const body: AuthBodyLogin = { email: 'test@test.com', password: '123456' }

      const result = await controller.login(body)

      expect(service.signin).toHaveBeenCalledWith(body)
      expect(result).toEqual({ token: 'fake-token' })
    })
  })
})
