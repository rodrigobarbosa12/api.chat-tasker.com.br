import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { FeatureFlagService } from 'src/applications/feature-flag/featureFlag.service'
import { ToggleFeatureBody } from 'src/infrastructure/dtos/admin'
import { Guard } from 'src/infrastructure/guards/Guard'

@Controller('/admin')
@ApiBearerAuth()
@ApiTags('ADMIN')
@UseGuards(Guard)
export class AdminController {
  constructor(private featureFlagService: FeatureFlagService) {}

  @Post('/toggle-feature')
  async toggleFeature(@Body() body: ToggleFeatureBody, @Req() req: Request) {
    const { accessRole } = req.session

    if (accessRole !== 'admin') {
      throw new UnauthorizedException('Você não tem permissão para isso!')
    }

    const { enable, feature, usersId } = body

    if (enable) {
      await this.featureFlagService.enableFeature(feature, usersId)
      return
    }

    await this.featureFlagService.disableFeature(feature, usersId)
  }
}
