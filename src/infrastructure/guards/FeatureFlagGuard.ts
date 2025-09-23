import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FeatureFlagService } from 'src/applications/feature-flag/featureFlag.service'
import { FEATURE_FLAG_KEY } from '../decorators/feature-flag'
import { getPayload } from '../utils'

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private featureFlagService: FeatureFlagService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const featureName = this.reflector.get<string>(
      FEATURE_FLAG_KEY,
      context.getHandler(),
    )
    if (!featureName) return true

    const request = context.switchToHttp().getRequest()
    const authorization = request?.headers?.authorization
    const token = authorization?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Você não está autorizado(a)')
    }

    const { payload } = getPayload(token)
    const userId = payload.user.id

    const enabled = await this.featureFlagService.isEnabled(featureName, userId)

    if (!enabled) {
      throw new ForbiddenException(`Feature ${featureName} não está ativa.`)
    }

    return true
  }
}
