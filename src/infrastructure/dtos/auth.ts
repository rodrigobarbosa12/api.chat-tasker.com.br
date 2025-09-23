import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, Length } from 'class-validator'

export enum UserRole {
  ADMIN = 'admin',
  DEFAULT = 'default',
}

export class AuthBodyCreate {
  @ApiProperty({ example: 'Usuário de Teste' })
  @Length(0, 100)
  @IsNotEmpty({
    message: 'Nome é obrigatório',
  })
  name: string

  @ApiProperty({ example: 'teste@email.com' })
  @IsNotEmpty({
    message: 'E-mail é obrigatório',
  })
  @Length(0, 100)
  email: string

  @ApiProperty({ example: 'Teste@123' })
  @IsNotEmpty({
    message: 'Senha é obrigatória',
  })
  @Length(0, 120)
  password: string

  @ApiProperty({ example: 'default' })
  @IsEnum(UserRole, { message: 'accessRole deve ser admin ou default' })
  accessRole?: 'admin' | 'default'
}

export class AuthBodyLogin {
  @ApiProperty({ example: 'teste@email.com' })
  @IsNotEmpty({
    message: 'E-mail é obrigatório',
  })
  @Length(0, 80)
  email: string

  @ApiProperty({ example: 'Teste@123' })
  @IsNotEmpty({
    message: 'Senha é obrigatória',
  })
  @Length(0, 120)
  password: string
}
