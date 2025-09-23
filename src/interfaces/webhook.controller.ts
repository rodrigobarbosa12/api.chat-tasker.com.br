import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { WebhookService } from 'src/applications/webhook/webhook.service'
import { Public } from 'src/infrastructure/decorators/public-route'
import { Guard } from 'src/infrastructure/guards/Guard'

@Controller('/webhook')
@UseGuards(Guard)
export class WebhookController {
  constructor(private webhook: WebhookService) {}

  @Post('/messages')
  @Public()
  async receiveMessage(@Body() body: { text: string; userId: number }) {
    return this.webhook.handleMessage(body.text, body.userId)
  }
}
