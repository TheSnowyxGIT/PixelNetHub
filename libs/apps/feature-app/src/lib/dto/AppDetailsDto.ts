import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { AppMetadata } from 'pixel-nethub-core/dist';

export class AppDetailsDto {
  static from(app: AppMetadata) {
    const dto = new AppDetailsDto();
    dto.name = app.name;
    dto.version = app.version;
    return dto;
  }
  @Expose()
  @ApiProperty({ example: 'app-name' })
  @IsString()
  name: string;

  @Expose()
  @ApiProperty({
    example: '1.0.0',
  })
  @IsString()
  version: string;
}
