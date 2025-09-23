import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class ChatBodyQuery {
  @ApiProperty()
  @IsOptional()
  search?: string

  @ApiProperty()
  @IsOptional()
  limit?: number
}
