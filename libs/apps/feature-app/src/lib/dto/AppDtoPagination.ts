import { ApiProperty } from '@nestjs/swagger';
import { PaginationTemplateDto } from 'libs/utils/pagination/pagination';
import { AppDto } from './AppDto';
import { Expose } from 'class-transformer';

export class AppDtoPagination extends PaginationTemplateDto<AppDto[]> {
  @ApiProperty({ type: [AppDto] })
  data: AppDto[];
}
