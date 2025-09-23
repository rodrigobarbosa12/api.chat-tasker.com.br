import { Module } from '@nestjs/common'
import { AiCacheService } from 'src/applications/ai/ai.cache.service'
import { AiService } from 'src/applications/ai/ai.service'
import { FeatureFlagService } from 'src/applications/feature-flag/featureFlag.service'
import { TasksService } from 'src/applications/tasks/tasks.service'
import { DatabaseModule } from 'src/infrastructure/database/typeorm/database.module'
import { providersDB } from 'src/infrastructure/database/typeorm/providers'
import { TasksController } from 'src/interfaces/tasks.controller'

@Module({
  controllers: [TasksController],
  imports: [DatabaseModule],
  providers: [
    TasksService,
    FeatureFlagService,
    AiService,
    AiCacheService,
    providersDB.task,
  ],
})
export class TasksModule {}
