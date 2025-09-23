import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as bcrypt from 'bcryptjs'
import { AuthService } from 'src/applications/auth/auth.service'
import * as security from 'src/infrastructure/security'

describe('AuthService', () => {
  let service: AuthService

  const mockRepo = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'USER_REPOSITORY', useValue: mockRepo },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('signup should call repository.save', async () => {
    mockRepo.findOneBy.mockResolvedValue(null)
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never)

    await service.signup({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
      accessRole: 'default',
    })

    expect(mockRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ password: 'hashed-password' }),
    )
  })

  it('signup should throw if user exists', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, email: 'test@test.com' })

    await expect(
      service.signup({
        name: 'Test',
        email: 'test@test.com',
        password: '123456',
        accessRole: 'default',
      }),
    ).rejects.toThrow(UnauthorizedException)
  })

  it('signin should return token object', async () => {
    const user = {
      id: 1,
      name: 'Test',
      email: 'test@test.com',
      accessRole: 'user',
      password: 'hashed-password',
    }

    mockRepo.findOneBy.mockResolvedValue(user)
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)
    jest.spyOn(security, 'createToken').mockReturnValue('token' as any)

    const result = await service.signin({
      email: 'test@test.com',
      password: '123',
    })

    expect(result).toEqual({
      token: 'token',
      refreshtoken: 'token',
      user: {
        id: 1,
        name: 'Test',
        email: 'test@test.com',
        accessRole: 'user',
      },
    })
  })

  it('signin should throw if user not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null)

    await expect(
      service.signin({ email: 'notfound@test.com', password: '123' }),
    ).rejects.toThrow(UnauthorizedException)
  })

  it('signin should throw if password is invalid', async () => {
    const user = {
      id: 1,
      name: 'Test',
      email: 'test@test.com',
      accessRole: 'user',
      password: 'hashed-password',
    }

    mockRepo.findOneBy.mockResolvedValue(user)
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)

    await expect(
      service.signin({ email: 'test@test.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException)
  })
})
