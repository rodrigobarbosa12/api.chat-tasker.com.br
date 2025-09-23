import * as jwt from 'jsonwebtoken'
import { createToken } from 'src/infrastructure/security'

jest.mock('jsonwebtoken')

describe('createToken', () => {
  it('should call jwt.sign with correct parameters and return token', () => {
    const mockSign = jest
      .spyOn(jwt, 'sign')
      .mockReturnValue('mocked-token' as never)

    const params = { userId: 1 }
    const expiresIn = '6h'

    const token = createToken(params, expiresIn)

    expect(mockSign).toHaveBeenCalledWith(
      params,
      process.env.JWT_SECRET || 'KIDS',
      { expiresIn },
    )

    expect(token).toBe('mocked-token')
  })
})
