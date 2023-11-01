import { Module } from '@nestjs/common';
import { FeatureAppService } from './feature-app.service';
import { DataAccessAppsDataModule } from 'libs/apps/data-access-apps-data/src';
import { DataAccessAppsStorageModule } from 'libs/apps/data-access-apps-storage/src';

@Module({
  imports: [DataAccessAppsDataModule, DataAccessAppsStorageModule],
  controllers: [],
  providers: [FeatureAppService],
  exports: [FeatureAppService],
})
export class FeatureAppModule {}
