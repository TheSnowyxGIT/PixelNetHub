import { Module } from '@nestjs/common';
import { FeatureScreenService } from './feature-screen.service';

@Module({
  providers: [FeatureScreenService],
  exports: [FeatureScreenService],
})
export class FeatureScreenModule {}
