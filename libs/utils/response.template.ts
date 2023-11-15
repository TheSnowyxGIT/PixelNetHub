import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, ValidateNested } from 'class-validator';

export abstract class SuccessTemplateDto<T> {
  @ApiProperty()
  @ValidateNested()
  abstract data: T;
}
