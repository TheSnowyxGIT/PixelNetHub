import { Module } from '@nestjs/common';
import { FeatureRunnerService } from './feature-runner.service';
import { FeatureAppModule } from 'libs/apps/feature-app/src';
import { FeatureAppLoggerModule } from 'libs/apps/feature-app-logger/src';

@Module({
  imports: [FeatureAppModule, FeatureAppLoggerModule],
  providers: [FeatureRunnerService],
  exports: [FeatureRunnerService],
})
export class FeatureRunnerModule {}
