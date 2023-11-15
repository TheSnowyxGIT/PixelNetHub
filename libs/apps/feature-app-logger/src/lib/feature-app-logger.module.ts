import { Module } from '@nestjs/common';
import { FeatureAppLoggerService } from './feature-app-logger.service';
import { AppLoggerCronService } from './app-logger.cron.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [FeatureAppLoggerService, AppLoggerCronService],
  exports: [FeatureAppLoggerService],
})
export class FeatureAppLoggerModule {}
