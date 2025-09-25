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
import { FeatureFlag } from 'src/infrastructure/decorators/feature-flag'
import { ChatBodyQuery } from 'src/infrastructure/dtos/chat'
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
  @FeatureFlag('findAll')
  findAll(@Query() query: ChatBodyQuery) {
    return this.tasks.findAll(query?.search, query?.limit)
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.tasks.findOne(+id)
  }

  @Post()
  async create(@Body() body: { text: string }, @Req() req: Request) {
    const { userId } = req.session

    return await this.tasks.createTask(body.text, userId)
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: { text: string }) {
    const usersId = 1

    await this.tasks.updateTask(id, body.text, usersId)
  }
}
