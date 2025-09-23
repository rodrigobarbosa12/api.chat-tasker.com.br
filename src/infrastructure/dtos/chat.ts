import { ApiProperty } from '@nestjs/swagger'

export class ChatBodyQuery {
  @ApiProperty()
  search?: string

  @ApiProperty()
  limit?: number
}
