import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from 'src/applications/auth/auth.service'
import { Public } from 'src/infrastructure/decorators/public-route'
import { AuthBodyCreate, AuthBodyLogin } from 'src/infrastructure/dtos/auth'
import { Guard } from 'src/infrastructure/guards/Guard'

@Controller('/auth')
@ApiTags('AUTH')
@UseGuards(Guard)
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post('/signup')
  @Public()
  async create(@Body() body: AuthBodyCreate): Promise<void> {
    await this.appService.signup(body)
  }

  @Post('/signin')
  @Public()
  async login(@Body() body: AuthBodyLogin) {
    return await this.appService.signin(body)
  }
}
