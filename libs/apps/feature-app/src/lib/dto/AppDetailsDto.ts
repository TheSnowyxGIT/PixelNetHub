import { ApiProperty } from '@nestjs/swagger';
import { AppMetadata } from 'pixel-nethub-core/dist';

export class AppDetailsDto {
  static from(app: AppMetadata) {
    const dto = new AppDetailsDto();
    dto.name = app.name;
    dto.version = app.version;
    return dto;
  }
  @ApiProperty({ example: 'app-name' })
  name: string;
  @ApiProperty({
    example: '1.0.0',
  })
  version: string;
}
