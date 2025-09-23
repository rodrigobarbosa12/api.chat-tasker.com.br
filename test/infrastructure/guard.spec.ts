import { Reflector } from '@nestjs/core'
import * as moment from 'moment'
import { Guard } from 'src/infrastructure/guards/Guard'
import * as utils from 'src/infrastructure/utils'

describe('Guard', () => {
  let guard: Guard
  let reflector: Reflector

  beforeEach(() => {
    reflector = new Reflector()
    guard = new Guard(reflector)
  })

  function mockContext(headers = {}, handlerPublic = false) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
      getHandler: () => ({}),
    } as any
  }

  it('deve permitir rota pública', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    const context = mockContext()
    await expect(guard.canActivate(context)).resolves.toBe(true)
  })

  it('deve lançar erro se não houver Authorization', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false)
    const context = mockContext()
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Você não está autorizado(a)',
    )
  })

  it('deve lançar erro se token mal formado', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false)
    const context = mockContext({ authorization: 'InvalidToken' })
    await expect(guard.canActivate(context)).rejects.toThrow('Token error')
  })

  it('deve lançar erro se schema não for Bearer', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false)
    const context = mockContext({ authorization: 'Basic token123' })
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Token mal formado',
    )
  })

  it('deve lançar erro se token expirado', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false)
    jest.spyOn(utils, 'getPayload').mockReturnValue({
      payload: {
        exp: moment().subtract(1, 'hour').unix(),
        id: '1',
        name: 'Test',
        email: 't@test.com',
      },
      user: {
        id: '1',
        name: 'Test',
        email: 't@test.com',
        accessRole: 'default',
      },
    })
    const context = mockContext({ authorization: 'Bearer token123' })
    await expect(guard.canActivate(context)).rejects.toThrow('Sessão expirada')
  })

  it('deve permitir token válido e setar session', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false)
    jest.spyOn(utils, 'getPayload').mockReturnValue({
      payload: {
        exp: moment().add(1, 'hour').unix(),
        id: '1',
        name: 'Test',
        email: 't@test.com',
        accessRole: 'user',
      },
      user: {
        id: '1',
        name: 'Test',
        email: 't@test.com',
        accessRole: 'default',
      },
    })

    jest.spyOn(utils, 'getPayload').mockReturnValue({
      payload: {
        exp: moment().add(1, 'hour').unix(),
        user: {
          id: 1,
          name: 'Test',
          email: 't@test.com',
          accessRole: 'user',
        },
      },
    } as any)

    const req: any = { headers: { authorization: 'Bearer token123' } }
    const context = {
      switchToHttp: () => ({ getRequest: () => req }),
      getHandler: () => ({}),
    } as any

    await expect(guard.canActivate(context)).resolves.toBe(true)

    expect(req.session).toEqual({
      userId: 1,
      name: 'Test',
      email: 't@test.com',
      accessRole: 'user',
    })
  })
})
