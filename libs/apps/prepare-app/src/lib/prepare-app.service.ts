import { Injectable, Module } from '@nestjs/common';
import decompress = require('decompress');
import path = require('path');
import fs = require('fs');
import { App } from 'libs/apps/feature-app/src';
import {
  InjectAppsConfig,
  AppsConfiguration,
} from 'libs/config/utils-config/src';

@Injectable()
export class PrepareAppService {
  constructor(
    @InjectAppsConfig() private readonly appsConfig: AppsConfiguration,
  ) {}

  async prepareApp(app: App): Promise<string> {
    const appPath = path.join(this.appsConfig.appsLocalDir, app.file);
    const distPath = path.join(this.appsConfig.appsLocalRunnerDir, app.name);

    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, { recursive: true, force: true });
    }

    await decompress(appPath, distPath);
    return distPath;
  }
}
