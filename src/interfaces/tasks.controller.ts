import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { Request } from 'express'
import { TasksService } from 'src/applications/tasks/tasks.service'
import { FeatureFlagVerify } from 'src/infrastructure/decorators/feature-flag-verify'
import { ChatBodyQuery } from 'src/infrastructure/dtos/chat'
import { TaskBody } from 'src/infrastructure/dtos/task'
import { FeatureFlagGuard } from 'src/infrastructure/guards/FeatureFlagGuard'
import { Guard } from 'src/infrastructure/guards/Guard'

@Controller('/tasks')
@ApiBearerAuth()
@ApiTags('TASKS')
@UseGuards(Guard)
@UseGuards(FeatureFlagGuard)
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @SkipThrottle()
  @FeatureFlagVerify('findAll')
  findAll(@Query() query: ChatBodyQuery, @Req() req: Request) {
    const { userId } = req.session

    return this.tasks.findAll(userId, query?.search, query?.limit)
  }

  @Get('/:id')
  @FeatureFlagVerify('findOne')
  findOne(@Param('id') id: string) {
    return this.tasks.findOne(+id)
  }

  @Post()
  async create(@Body() body: TaskBody, @Req() req: Request) {
    const { userId } = req.session

    return await this.tasks.createTask(body.text, userId)
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: TaskBody) {
    const usersId = 1

    await this.tasks.updateTask(id, body.text, usersId)
  }
}
