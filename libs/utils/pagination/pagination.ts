import { ApiProperty } from '@nestjs/swagger';
import { SuccessTemplateDto } from '../response.template';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class PaginationMeta {
  static from(currentPage: number, perPage: number, total: number) {
    const meta = new PaginationMeta();
    meta.current_page = currentPage;
    meta.per_page = perPage;
    meta.last_page = total === 0 ? 1 : Math.ceil(total / perPage);
    meta.total = total;
    return meta;
  }
  @Expose()
  @ApiProperty()
  @IsNumber()
  total: number;
  @Expose()
  @ApiProperty()
  @IsNumber()
  per_page: number;
  @Expose()
  @ApiProperty()
  @IsNumber()
  current_page: number;
  @Expose()
  @ApiProperty()
  last_page: number;
  @Expose()
  @ApiProperty()
  first_page = 1;
}

export abstract class PaginationTemplateDto<T> extends SuccessTemplateDto<T> {
  @Expose()
  @ApiProperty()
  @Type(() => PaginationMeta)
  meta: PaginationMeta;
}
