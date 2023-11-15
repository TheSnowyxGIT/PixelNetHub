import { ApiProperty } from '@nestjs/swagger';
import { SuccessTemplateDto } from './response.template';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class PaginationMeta {
  static from(currentPage: number, perPage: number, total: number) {
    const meta = new PaginationMeta();
    meta.current_page = currentPage;
    meta.per_page = perPage;
    meta.last_page = Math.ceil(total / perPage) + 1;
    meta.total = total;
    return meta;
  }
  @ApiProperty()
  @IsNumber()
  total: number;
  @ApiProperty()
  @IsNumber()
  per_page: number;
  @ApiProperty()
  @IsNumber()
  current_page: number;
  @ApiProperty()
  last_page: number;
  @ApiProperty()
  first_page = 1;
}

export abstract class PaginationTemplateDto<T> extends SuccessTemplateDto<T> {
  @ApiProperty()
  @ValidateNested()
  meta: PaginationMeta;
}
