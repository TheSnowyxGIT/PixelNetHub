import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDateString, IsString } from 'class-validator';
import { v4 } from 'uuid';

export class AppHistoryDto {
  @Expose()
  @ApiProperty({ example: `${v4()}` })
  @IsString()
  id: string;
  @Expose()
  @ApiProperty({ example: 'app-name' })
  @IsString()
  name: string;
  @Expose()
  @ApiProperty({ example: '1.0.0' })
  @IsString()
  version: string;
  @Expose()
  @ApiProperty()
  @IsBoolean()
  success: boolean;
  @Expose()
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string;
  @Expose()
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @IsDateString()
  endDate: string;
  @Expose()
  @ApiProperty()
  @IsBoolean()
  logsAvailable: boolean;
}
