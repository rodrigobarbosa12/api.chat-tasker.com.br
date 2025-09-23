import { decode } from 'jsonwebtoken'
import { getPayload, Result } from 'src/infrastructure/utils'

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn(),
}))

describe('getPayload', () => {
  it('deve retornar null se decode retornar null', () => {
    ;(decode as jest.Mock).mockReturnValue(null)

    const result = getPayload('token123')
    expect(result).toBeNull()
  })

  it('deve mapear corretamente o payload do token', () => {
    ;(decode as jest.Mock).mockReturnValue({
      payload: {
        sub: '1',
        fullName: 'Test User',
        email: 'test@example.com',
        accessRole: 'admin',
      },
    })

    const result: Result = getPayload('token123')
    expect(result).toEqual({
      payload: {
        sub: '1',
        fullName: 'Test User',
        email: 'test@example.com',
        accessRole: 'admin',
      },
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        accessRole: 'admin',
      },
    })
  })

  it('deve lidar com payload parcialmente indefinido', () => {
    ;(decode as jest.Mock).mockReturnValue({
      payload: {
        sub: undefined,
        fullName: undefined,
        email: undefined,
        accessRole: undefined,
      },
    })

    const result: Result = getPayload('token123')
    expect(result).toEqual({
      payload: {
        sub: undefined,
        fullName: undefined,
        email: undefined,
        accessRole: undefined,
      },
      user: {
        id: undefined,
        name: undefined,
        email: undefined,
        accessRole: undefined,
      },
    })
  })
})
