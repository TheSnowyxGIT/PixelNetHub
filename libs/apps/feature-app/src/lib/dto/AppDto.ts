import { ApiProperty } from '@nestjs/swagger';
import { App } from '../model/App';

export class AppDto {
  static from(app: App) {
    const dto = new AppDto();
    dto.name = app.name;
    dto.versions = app.versions;
    return dto;
  }
  @ApiProperty({ example: 'app-name' })
  name: string;
  @ApiProperty({
    example: ['1.0.0', '1.0.1'],
  })
  versions: string[];
}
