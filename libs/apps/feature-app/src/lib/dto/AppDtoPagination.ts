import { ApiProperty } from '@nestjs/swagger';
import { PaginationTemplateDto } from 'libs/utils/pagination';
import { AppDto } from './AppDto';

export class AppDtoPagination extends PaginationTemplateDto<AppDto[]> {
  @ApiProperty({ type: [AppDto] })
  data: AppDto[];
}
