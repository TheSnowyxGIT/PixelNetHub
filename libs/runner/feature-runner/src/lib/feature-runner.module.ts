import { Module } from '@nestjs/common';
import { FeatureRunnerService } from './feature-runner.service';
import { FeatureAppModule } from 'libs/apps/feature-app/src';
import { PrepareAppModule } from 'libs/apps/prepare-app/src';
import { FeatureScreenModule } from 'libs/screen/feature-screen/src';
import { FeatureFontModule } from 'libs/fonts/feature-font/src';

@Module({
  controllers: [],
  imports: [
    FeatureAppModule,
    PrepareAppModule,
    FeatureScreenModule,
    FeatureFontModule,
  ],
  providers: [FeatureRunnerService],
  exports: [FeatureRunnerService],
})
export class FeatureRunnerModule {}
