import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function useSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Api docs')
    .setDescription('Teste da api sem precisar do postman ou insomnia')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/docs', app, document)
}
