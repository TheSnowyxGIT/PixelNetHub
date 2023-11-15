import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationQueryDto {
  constructor(page: number, limit: number) {
    this.page = page || 1;
    this.limit = limit || 10;
  }
  @ApiProperty({ default: 1, required: false })
  @IsNumber()
  page: number;

  @ApiProperty({ default: 10, required: false })
  @IsNumber()
  limit: number;
}
