import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

export enum FeatureRole {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
}

export class ToggleFeatureBody {
  @ApiProperty()
  @IsNotEmpty({
    message: 'enable é obrigatório',
  })
  enable: boolean

  @ApiProperty()
  @IsNotEmpty({
    message: 'feature é obrigatória',
  })
  @IsEnum(FeatureRole, { message: 'accessRole deve ser admin ou default' })
  feature: 'findAll' | 'findOne'

  @ApiProperty()
  @IsNotEmpty({
    message: 'usersId é obrigatório',
  })
  usersId: number
}
