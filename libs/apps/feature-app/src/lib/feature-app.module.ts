import { Module } from '@nestjs/common';
import { FeatureAppService } from './feature-app.service';
import { FeatureAppController } from './feature-app.controller';

@Module({
  imports: [],
  controllers: [FeatureAppController],
  providers: [FeatureAppService],
  exports: [FeatureAppService],
})
export class FeatureAppModule {}
