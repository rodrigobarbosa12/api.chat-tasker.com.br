import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import { useSwagger } from '../swagger'
import { ConfigModule } from './config.module'

export async function configapp() {
  const app = await NestFactory.create(ConfigModule, {
    bufferLogs: true,
    cors: true,
  })

  useSwagger(app)

  app.use(cookieParser())
  app.use(cors())
  app.useGlobalPipes(new ValidationPipe())

  return app
}
