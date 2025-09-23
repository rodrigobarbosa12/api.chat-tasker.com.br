import { Module } from '@nestjs/common'
import { FeatureFlagService } from 'src/applications/feature-flag/featureFlag.service'
import { AdminController } from 'src/interfaces/admin.controller'

@Module({
  controllers: [AdminController],
  providers: [FeatureFlagService],
})
export class AdminModule {}
