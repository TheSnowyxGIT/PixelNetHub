import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { FontsModule } from 'src/fonts/fonts.module';
import { ScreenModule } from 'src/screen/screen.module';
import { AppLoggerModule } from './app-logger/app-logger.module';

@Module({
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  imports: [FontsModule, ScreenModule, AppLoggerModule],
})
export class ApplicationsModule {}
