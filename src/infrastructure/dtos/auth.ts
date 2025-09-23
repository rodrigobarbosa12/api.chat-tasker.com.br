import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, Length } from 'class-validator'

export enum UserRole {
  ADMIN = 'admin',
  DEFAULT = 'default',
}

export class AuthBodyCreate {
  @ApiProperty()
  @Length(0, 100)
  @IsNotEmpty({
    message: 'Nome é obrigatório',
  })
  name: string

  @ApiProperty()
  @IsNotEmpty({
    message: 'E-mail é obrigatório',
  })
  @Length(0, 100)
  email: string

  @ApiProperty()
  @IsNotEmpty({
    message: 'Senha é obrigatória',
  })
  @Length(0, 120)
  password: string

  @IsEnum(UserRole, { message: 'accessRole deve ser admin ou default' })
  accessRole?: 'admin' | 'default'
}

export class AuthBodyLogin {
  @ApiProperty()
  @IsNotEmpty({
    message: 'E-mail é obrigatório',
  })
  @Length(0, 80)
  email: string

  @ApiProperty()
  @IsNotEmpty({
    message: 'Senha é obrigatória',
  })
  @Length(0, 120)
  password: string
}
