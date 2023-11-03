import { Module } from '@nestjs/common';
import { FeatureRunnerService } from './feature-runner.service';
import { FeatureAppModule } from 'libs/apps/feature-app/src';
import { FeatureScreenModule } from 'libs/screen/feature-screen/src';
import { FeatureFontModule } from 'libs/fonts/feature-font/src';

@Module({
  controllers: [],
  imports: [FeatureAppModule, FeatureScreenModule, FeatureFontModule],
  providers: [FeatureRunnerService],
  exports: [FeatureRunnerService],
})
export class FeatureRunnerModule {}
