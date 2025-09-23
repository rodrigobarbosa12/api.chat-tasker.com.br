import { Module } from '@nestjs/common'
import { AuthService } from 'src/applications/auth/auth.service'
import { DatabaseModule } from 'src/infrastructure/database/typeorm/database.module'
import { providersDB } from 'src/infrastructure/database/typeorm/providers'
import { AuthController } from 'src/interfaces/auth.controller'

@Module({
  controllers: [AuthController],
  imports: [DatabaseModule],
  providers: [providersDB.user, AuthService],
})
export class AuthModule {}
