import { Module } from '@nestjs/common';
import { DataAccessAppsStorageService } from './data-access-apps-storage.service';

@Module({
  providers: [DataAccessAppsStorageService],
  exports: [DataAccessAppsStorageService],
})
export class DataAccessAppsStorageModule {}
