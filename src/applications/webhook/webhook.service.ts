import { Injectable } from '@nestjs/common'
import { TasksService } from '../tasks/tasks.service'

@Injectable()
export class WebhookService {
  constructor(private tasks: TasksService) {}

  async handleMessage(text: string, userId: number) {
    return this.tasks.createTask(text, userId)
  }
}
