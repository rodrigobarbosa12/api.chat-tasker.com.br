import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { WebhookService } from 'src/applications/webhook/webhook.service'
import { Public } from 'src/infrastructure/decorators/public-route'
import { WebhookBody } from 'src/infrastructure/dtos/task'
import { Guard } from 'src/infrastructure/guards/Guard'

@Controller('/webhook')
@ApiTags('WEBHOOK')
@UseGuards(Guard)
export class WebhookController {
  constructor(private webhook: WebhookService) {}

  @Post('/messages')
  @Public()
  async receiveMessage(@Body() body: WebhookBody) {
    return this.webhook.handleMessage(body.text, body.userId)
  }
}
