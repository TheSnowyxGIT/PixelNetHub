import { Module } from '@nestjs/common';
import { FeatureAppService } from './feature-app.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FeatureAppService],
  exports: [FeatureAppService],
})
export class FeatureAppModule {}
