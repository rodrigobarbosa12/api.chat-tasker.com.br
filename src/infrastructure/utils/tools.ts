import { decode, type JwtPayload } from 'jsonwebtoken'

export type CustomPayload = JwtPayload & {
  id: string
  name: string
  email: string
  azp?: string
}

export interface Result {
  payload: CustomPayload
  user: {
    id: string
    name: string
    email: string
    accessRole: 'admin' | 'default'
  }
}

export function getPayload(token: string): Result {
  const tokenDecoded = decode(token, { complete: true })

  if (!tokenDecoded) {
    return null
  }

  const payload = tokenDecoded.payload as CustomPayload

  return {
    payload,
    user: {
      id: payload?.sub,
      name: payload?.fullName,
      email: payload?.email,
      accessRole: payload?.accessRole,
    },
  }
}
