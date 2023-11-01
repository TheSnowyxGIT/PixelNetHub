import { Injectable } from '@nestjs/common';
import { App } from './apps.models';
import {
  AppData,
  AppDataDocument,
  DataAccessAppsDataRepository,
} from 'libs/apps/data-access-apps-data/src';
import { DataAccessAppsStorageService } from 'libs/apps/data-access-apps-storage/src';

@Injectable()
export class FeatureAppService {
  constructor(
    private readonly appsDataRepository: DataAccessAppsDataRepository,
    private readonly appsStorageService: DataAccessAppsStorageService,
  ) {}

  async getApp(name: string, version?: string): Promise<AppData | null> {
    let appData: AppData;
    if (version) {
      appData = await this.appsDataRepository.getAppWithVersion(name, version);
    } else {
      appData = await this.appsDataRepository.get(name);
    }
    if (!appData) {
      return null;
    }

    // now get the app from the storage
    const appFile = await this.appsStorageService.get(
      appData.fileName(version),
    );
    if (!appFile) {
      // should not happen
      throw new Error('App file associated with the app data does not exist');
    }

    return appData;
  }
}
