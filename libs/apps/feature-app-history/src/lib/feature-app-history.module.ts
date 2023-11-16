import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FeatureAppHistoryService } from './feature-app-history.service';
import { FeatureAppHistoryController } from './feature-app-history.controller';
import { FeatureAppLoggerModule } from 'libs/apps/feature-app-logger/src';

@Module({
  imports: [ScheduleModule.forRoot(), FeatureAppLoggerModule],
  controllers: [FeatureAppHistoryController],
  providers: [FeatureAppHistoryService],
  exports: [FeatureAppHistoryService],
})
export class FeatureAppHistoryModule {}
