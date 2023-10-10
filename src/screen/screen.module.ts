import { Module } from '@nestjs/common';
import { ScreenService } from './screen.service';

@Module({
  providers: [ScreenService],
  exports: [ScreenService],
})
export class ScreenModule {}
