import type { SignOptions } from 'jsonwebtoken'
import * as jwt from 'jsonwebtoken'

export function createToken(Params: object, expiresIn: number | string) {
  return jwt.sign(Params, process.env.JWT_SECRET || 'KIDS', {
    expiresIn,
  } as SignOptions)
}
