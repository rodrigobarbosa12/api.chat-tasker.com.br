import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import * as moment from 'moment'
import { getPayload } from '../utils'

@Injectable()
export class Guard implements CanActivate {
  logger = new Logger(Guard.name)

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    )

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    const authorization = request?.headers?.authorization

    if (!authorization) {
      throw new UnauthorizedException('Você não está autorizado(a)')
    }

    // Bearer lkasdjfksdfaDJKÇLÇLKASDA
    const parts = authorization.split(' ')

    if (parts.length !== 2) {
      throw new UnauthorizedException('Token error')
    }

    const [schema, token] = parts

    if (!/^Bearer$/i.test(schema)) {
      throw new UnauthorizedException('Token mal formado')
    }

    if (!token) {
      throw new UnauthorizedException('Token error')
    }

    const decoded = getPayload(token)

    if (!decoded?.payload?.exp) {
      throw new UnauthorizedException('Token inválido')
    }

    const { payload } = decoded

    if (moment() > moment.unix(payload?.exp)) {
      throw new UnauthorizedException('Sessão expirada')
    }

    request.session = {
      userId: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
      accessRole: payload?.user?.accessRole,
    }

    return true
  }
}
