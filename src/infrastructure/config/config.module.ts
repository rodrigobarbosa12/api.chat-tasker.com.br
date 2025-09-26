import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'
import { join } from 'path'
import { AdminModule } from './modules/admin.module'
import { AuthModule } from './modules/auth.module'
import { TasksModule } from './modules/tasks.module'
import { WebhookModule } from './modules/webhook.module'

@Module({
  imports: [
    PrometheusModule.register(), // Gera o endpoint /metrics
    ThrottlerModule.forRoot([
      {
        ttl: 10000, // tempo em milissegundos
        limit: 1, // máximo de requisições por ttl
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', '..', 'public', 'coverage'),
      serveRoot: '/coverage',
      serveStaticOptions: {
        index: 'index.html',
      },
    }),
    AuthModule,
    WebhookModule,
    TasksModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ConfigModule {}
