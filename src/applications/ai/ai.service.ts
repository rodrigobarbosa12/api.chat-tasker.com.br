import { StringOutputParser } from '@langchain/core/output_parsers'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'
import { Injectable, Logger } from '@nestjs/common'
import * as crypto from 'crypto'
import OpenAI from 'openai'
import { AiCacheService } from './ai.cache.service'

interface Task {
  title: string
  description: string
}

interface PrioritizeResp {
  priorityLevel: string
  priorityScore: number
  explain: string
}

@Injectable()
export class AiService {
  logger = new Logger(AiService.name)

  llmOpenAILC: ChatOpenAI
  llmOpenAI: OpenAI

  constructor(private cacheRedis: AiCacheService) {
    this.llmOpenAILC = new ChatOpenAI({
      model: 'gpt-4o-mini',
      apiKey: process.env.OPENAI_API_KEY,
    })

    this.llmOpenAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  private generateCacheKey(prefix: string, input: string) {
    const hash = crypto.createHash('md5').update(input).digest('hex')
    return `${prefix}:${hash}`
  }

  private async getCacheRedis<T>(prefix: string, input: string) {
    const key = this.generateCacheKey(prefix, input)
    const cached = await this.cacheRedis.get<T>(key)

    return { key, cached }
  }

  private async serCacheRedis<T>(key: string, value: T) {
    await this.cacheRedis.set<T>(key, value)
  }

  async summarize(text: string): Promise<Task> {
    const { cached, key } = await this.getCacheRedis<Task>('summarize', text)

    if (cached) return cached

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        'Você é um assistente que transforma textos em tarefas resumidas.',
      ),
      HumanMessagePromptTemplate.fromTemplate(
        `Texto: {text}
          Gere um JSON com:
          - title: título curto da tarefa (5-8 palavras).
          - description: descrição resumida da tarefa.

          A resposta será processada com JSON.parse(), portanto, qualquer caractere fora do JSON puro causará erro
        `,
      ),
    ])

    const chain = RunnableSequence.from([
      prompt,
      this.llmOpenAILC,
      new StringOutputParser(),
    ])

    const result = JSON.parse(await chain.invoke({ text }))

    await this.serCacheRedis(key, result)

    return result
  }

  async prioritize(task: Task): Promise<PrioritizeResp> {
    const { cached, key } = await this.getCacheRedis<PrioritizeResp>(
      'prioritize',
      `${task.title}:${task.description}`,
    )

    if (cached) return cached

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        'Você é um assistente que avalia a prioridade de tarefas.',
      ),
      HumanMessagePromptTemplate.fromTemplate(
        `Título: {title}
          Descrição: {description}
          Gere um JSON com:
          - priorityLevel: low, medium ou high
          - priorityScore: número entre 0 e 1
          - explain: breve justificativa

          A resposta será processada com JSON.parse(), portanto, qualquer caractere fora do JSON puro causará erro
        `,
      ),
    ])

    try {
      const chain = RunnableSequence.from([
        prompt,
        this.llmOpenAILC,
        new StringOutputParser(),
      ])

      const result = JSON.parse(
        await chain.invoke({
          title: task.title,
          description: task.description,
        }),
      )
      await this.serCacheRedis(key, result)
      return result
    } catch (error) {
      this.logger.error(error)

      return {
        priorityLevel: 'medium',
        priorityScore: 0.5,
        explain: 'Heurística padrão',
      }
    }
  }

  async embed(text: string): Promise<number[]> {
    const { cached, key } = await this.getCacheRedis<number[]>('embed', text)

    if (cached) return cached

    const response = await this.llmOpenAI.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })

    const embedding = response.data[0].embedding
    await this.serCacheRedis(key, embedding)

    return embedding
  }
}
