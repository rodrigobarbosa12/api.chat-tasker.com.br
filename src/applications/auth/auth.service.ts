import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { User } from 'src/infrastructure/database/typeorm/entity/User'
import { AuthBodyCreate, AuthBodyLogin } from 'src/infrastructure/dtos/auth'
import { createToken } from 'src/infrastructure/security'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async signup(data: AuthBodyCreate): Promise<void> {
    const { name, email, password, accessRole } = data

    const userExists = await this.userRepository.findOneBy({
      email: email,
    })

    if (userExists) {
      this.logger.error('Usuário já existe')
      throw new UnauthorizedException('Usuário já existe')
    }

    const hash = await bcrypt.hash(password, 10)

    await this.userRepository.save({
      name,
      email,
      accessRole,
      password: hash,
    })
  }

  async signin(data: AuthBodyLogin) {
    const { email, password } = data

    const userFound = await this.userRepository.findOneBy({
      email: email,
    })

    if (!userFound) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const userValid = await bcrypt.compare(password, userFound.password)

    if (!userValid) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const params = {
      user: {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
        accessRole: userFound.accessRole,
      },
    }

    const token = createToken(params, '6h')
    const refreshtoken = createToken(params, '24h')

    return { token, refreshtoken, user: params.user }
  }
}
