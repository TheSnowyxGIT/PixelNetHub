import { ApiProperty } from '@nestjs/swagger';
import { App } from '../model/App';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class AppDto {
  static from(app: App) {
    const dto = new AppDto();
    dto.name = app.name;
    dto.versions = app.versions;
    return dto;
  }

  @Expose()
  @ApiProperty({ example: 'app-name' })
  @IsString()
  name: string;

  @Expose()
  @ApiProperty({
    example: ['1.0.0', '1.0.1'],
  })
  @IsString({ each: true })
  versions: string[];
}
