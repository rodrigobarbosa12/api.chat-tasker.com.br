import { Module } from '@nestjs/common'
import { AiCacheService } from 'src/applications/ai/ai.cache.service'
import { AiService } from 'src/applications/ai/ai.service'
import { TasksService } from 'src/applications/tasks/tasks.service'
import { WebhookService } from 'src/applications/webhook/webhook.service'
import { DatabaseModule } from 'src/infrastructure/database/typeorm/database.module'
import { providersDB } from 'src/infrastructure/database/typeorm/providers'
import { WebhookController } from 'src/interfaces/webhook.controller'

@Module({
  controllers: [WebhookController],
  imports: [DatabaseModule],
  providers: [
    WebhookService,
    TasksService,
    AiService,
    AiCacheService,
    providersDB.task,
  ],
})
export class WebhookModule {}
