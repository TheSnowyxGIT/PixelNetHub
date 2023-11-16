import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, ValidateNested } from 'class-validator';

export abstract class SuccessTemplateDto<T> {
  @Expose()
  @ApiProperty()
  @ValidateNested()
  abstract data: T;
}
