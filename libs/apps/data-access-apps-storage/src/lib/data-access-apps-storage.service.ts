import { Injectable, Logger } from '@nestjs/common';
import {
  AppsConfiguration,
  AwsConfiguration,
  InjectAppsConfig,
  InjectAwsConfig,
} from 'libs/config/utils-config/src';
import { DataAccessStorageService } from 'libs/data-access-storage/src';

@Injectable()
export class DataAccessAppsStorageService extends DataAccessStorageService<ArrayBuffer> {
  constructor(
    @InjectAwsConfig() readonly awsConfig: AwsConfiguration,
    @InjectAppsConfig() readonly appsConfig: AppsConfiguration,
  ) {
    super({
      awsConfig,
      bucketName: appsConfig.appsAwsBucket,
      localDir: appsConfig.appsLocalDir,
      logger: new Logger(DataAccessAppsStorageService.name),
      transform: async (buffer) => {
        return buffer;
      },
      activateAws: false,
      type: 'App',
    });
  }
}
