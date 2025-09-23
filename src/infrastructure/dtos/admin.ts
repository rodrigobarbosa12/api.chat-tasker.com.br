import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

export enum FeatureRole {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
}

export class ToggleFeatureBody {
  @ApiProperty({ example: true })
  @IsNotEmpty({
    message: 'enable é obrigatório',
  })
  enable: boolean

  @ApiProperty({ example: 'findAll' })
  @IsNotEmpty({
    message: 'feature é obrigatória',
  })
  @IsEnum(FeatureRole, { message: 'accessRole deve ser admin ou default' })
  feature: 'findAll' | 'findOne'

  @ApiProperty({ example: 1 })
  @IsNotEmpty({
    message: 'usersId é obrigatório',
  })
  usersId: number
}
