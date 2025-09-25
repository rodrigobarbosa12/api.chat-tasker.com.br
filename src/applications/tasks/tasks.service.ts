import { Inject, Injectable } from '@nestjs/common'
import { Task } from 'src/infrastructure/database/typeorm/entity/Task'
import { Repository } from 'typeorm'
import { AiService } from '../ai/ai.service'

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private taskRepository: Repository<Task>,

    private ai: AiService,
  ) {}

  async createTask(text: string, userId: number) {
    const { title, description } = await this.ai.summarize(text)
    const { priorityLevel, priorityScore, explain } = await this.ai.prioritize({
      title,
      description,
    })

    const embedding = await this.ai.embed(text)

    const task = this.taskRepository.create({
      user: { id: userId } as any,
      originalText: text,
      title,
      description,
      priority: priorityLevel,
      priorityScore,
      priorityExplain: explain,
      embedding,
      createdBy: userId,
      updatedBy: userId,
    })

    const response = await this.ai.responseForUser(task)

    await this.taskRepository.save(task)

    return {
      text: response,
      time: task.createdAt,
      isUser: false,
    }
  }

  async updateTask(id: number, text: string, userId: number) {
    const { title, description } = await this.ai.summarize(text)
    const { priorityLevel, priorityScore, explain } = await this.ai.prioritize({
      title,
      description,
    })

    const embedding = await this.ai.embed(text)

    const taskFound = await this.taskRepository.findOneBy({ id })

    await this.taskRepository.update(taskFound.id, {
      user: { id: userId } as any,
      originalText: text,
      title,
      description,
      priority: priorityLevel,
      priorityScore,
      priorityExplain: explain,
      embedding,
      updatedBy: userId,
    })
  }

  async findAll(search?: string, limit = 10) {
    const qb = this.taskRepository.createQueryBuilder('task')

    qb.select([
      'task.id',
      'task.title',
      'task.description',
      'task.status',
      'task.priority',
      'task.priorityExplain',
      'task.createdAt',
    ])

    qb.limit(limit)

    if (search) {
      const queryEmbedding = await this.ai.embed(search)
      const embeddingString = `[${queryEmbedding.join(',')}]`

      qb.addSelect(`task.embedding <-> :queryEmbedding::vector`, 'distance')
        .setParameter('queryEmbedding', embeddingString)
        .addOrderBy('distance', 'ASC')

      const { entities, raw } = await qb.getRawAndEntities()

      return entities.map((task, i) => ({
        ...task,
        distance: raw[i].distance,
      }))
    }

    qb.orderBy(
      `
        CASE task.priority
          WHEN 'high' THEN 3
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 1
        END
      `,
      'DESC',
    )

    return qb.getMany()
  }

  findOne(id: number) {
    return this.taskRepository.findOne({ where: { id } })
  }
}
