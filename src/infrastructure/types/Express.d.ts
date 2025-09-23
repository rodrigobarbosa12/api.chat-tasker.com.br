export interface Session {
  userId: number
  email: string
  name: string
  accessRole?: 'admin' | 'default'
}

declare global {
  namespace Express {
    interface Request {
      session?: Session
    }
  }
}

export default global
