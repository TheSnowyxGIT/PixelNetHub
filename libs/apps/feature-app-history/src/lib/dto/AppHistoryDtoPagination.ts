import { ApiProperty } from '@nestjs/swagger';
import { PaginationTemplateDto } from 'libs/utils/pagination/pagination';
import { AppHistoryDto } from './AppHistoryDto';
import { Expose, Type } from 'class-transformer';

export class AppHistoryDtoPagination extends PaginationTemplateDto<
  AppHistoryDto[]
> {
  @ApiProperty({ type: [AppHistoryDto] })
  @Type(() => AppHistoryDto)
  data: AppHistoryDto[];
}
