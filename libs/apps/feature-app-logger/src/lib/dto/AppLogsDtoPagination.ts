import { ApiProperty } from '@nestjs/swagger';
import { PaginationTemplateDto } from 'libs/utils/pagination/pagination';

export class AppLogsDtoPagination extends PaginationTemplateDto<string[]> {
  @ApiProperty({ type: [String] })
  data: string[];
}
