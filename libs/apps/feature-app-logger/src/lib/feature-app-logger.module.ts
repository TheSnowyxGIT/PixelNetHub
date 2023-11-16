import { Module } from '@nestjs/common';
import { FeatureAppLoggerService } from './feature-app-logger.service';
import { AppLoggerCronService } from './app-logger.cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FeatureAppLoggerController } from './feature-app-logger.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [FeatureAppLoggerController],
  providers: [FeatureAppLoggerService, AppLoggerCronService],
  exports: [FeatureAppLoggerService],
})
export class FeatureAppLoggerModule {}
