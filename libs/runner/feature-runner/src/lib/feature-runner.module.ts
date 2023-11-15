import { Module } from '@nestjs/common';
import { FeatureRunnerService } from './feature-runner.service';
import { FeatureAppModule } from 'libs/apps/feature-app/src';
import { FeatureAppLoggerModule } from 'libs/apps/feature-app-logger/src';
import {
  FeatureAppHistoryModule,
  FeatureAppHistoryService,
} from 'libs/apps/feature-app-history/src';

@Module({
  imports: [FeatureAppModule, FeatureAppLoggerModule, FeatureAppHistoryModule],
  providers: [FeatureRunnerService],
  exports: [FeatureRunnerService],
})
export class FeatureRunnerModule {}
