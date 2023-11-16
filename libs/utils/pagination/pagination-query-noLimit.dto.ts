import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginationQueryNoLimitDto {
  constructor(page: number) {
    this.page = page || 1;
  }
  @ApiProperty({ default: 1, required: false })
  @IsNumber()
  page: number;
}
