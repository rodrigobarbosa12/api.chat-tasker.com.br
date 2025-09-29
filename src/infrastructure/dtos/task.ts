import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class TaskBody {
  @ApiProperty({ example: 'Reunião de alinhamento sexta feita as 15h' })
  @IsNotEmpty({
    message: 'text é obrigatório',
  })
  text?: string
}

export class WebhookBody {
  @ApiProperty({ example: 'Reunião de alinhamento sexta feita as 15h' })
  @IsNotEmpty({
    message: 'text é obrigatório',
  })
  text?: string

  @ApiProperty({ example: 1 })
  @IsNotEmpty({
    message: 'userId é obrigatório',
  })
  userId: number
}
