import { Module } from '@nestjs/common'
import { AiService } from 'src/applications/ai/ai.service'

@Module({
  providers: [AiService],
})
export class AiModule {}
