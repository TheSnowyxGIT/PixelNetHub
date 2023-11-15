import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FeatureAppHistoryService } from './feature-app-history.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [FeatureAppHistoryService],
  exports: [FeatureAppHistoryService],
})
export class FeatureAppHistoryModule {}
