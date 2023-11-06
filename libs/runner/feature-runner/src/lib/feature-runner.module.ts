import { Module } from '@nestjs/common';
import { FeatureRunnerService } from './feature-runner.service';
import { FeatureAppModule } from 'libs/apps/feature-app/src';

@Module({
  imports: [FeatureAppModule],
  providers: [FeatureRunnerService],
  exports: [FeatureRunnerService],
})
export class FeatureRunnerModule {}
