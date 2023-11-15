import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RunnerAppNotFoundError } from './errors/RunnerError';
import { FeatureAppService } from 'libs/apps/feature-app/src';
import * as core from 'pixel-nethub-core';
import { spawn } from 'child_process';
import { AppCoreInstance } from './app-core-instance';
import {
  AppConfiguration,
  InjectAppConfig,
} from 'libs/config/utils-config/src';
import { writeFileSync } from 'fs';
import { FeatureAppLoggerService } from 'libs/apps/feature-app-logger/src';

@Injectable()
export class FeatureRunnerService {
  private readonly logger = new Logger(FeatureRunnerService.name);

  private appInstance?: AppCoreInstance;

  private phnAppConfigPath = 'pnh-app-config.json';

  constructor(
    private readonly appsService: FeatureAppService,
    private readonly appLoggerService: FeatureAppLoggerService,
    @InjectAppConfig() private readonly appConfig: AppConfiguration,
  ) {
    const config = this.getPNHAppConfig();
    writeFileSync(this.phnAppConfigPath, JSON.stringify(config));
  }

  private getPNHAppConfig() {
    return {
      screenSize: [this.appConfig.screenWidth, this.appConfig.screenHeight],
    };
  }

  private isRunning(): boolean {
    return this.appInstance !== undefined;
  }

  async startFromPath(appPath: string) {
    const appMetaData = await core.AppMetadata.load(appPath);
    await this.startApp(appMetaData);
  }

  async startFromDownloadedApps(appName: string, version?: string) {
    let app: core.AppMetadata;
    if (!version) {
      app = await this.appsService.getAppLatest(appName);
    } else {
      app = await this.appsService.getApp(appName, version);
    }
    if (!app) {
      throw new RunnerAppNotFoundError(appName, version);
    }
    const appMetaData = await core.AppMetadata.load(app.appPath);
    await this.startApp(appMetaData);
  }

  private async startApp(appMetaData: core.AppMetadata) {
    // Stop the previous app
    if (this.isRunning()) {
      await this.stopApp();
    }

    const streamRouter = this.appLoggerService.getStreamRotator(appMetaData);

    // Start the new app
    this.appInstance = AppCoreInstance.create(
      appMetaData,
      this.phnAppConfigPath,
      streamRouter,
    );

    this.appInstance.on('close', () => {
      if (this.appInstance.returnCode === 0) {
        this.logger.log(
          `App ${appMetaData.name}@${appMetaData.version} closed with return code ${this.appInstance.returnCode}`,
        );
      } else {
        this.logger.warn(
          `App ${appMetaData.name}@${appMetaData.version} closed with return code ${this.appInstance.returnCode}`,
        );
      }
      this.appInstance = undefined;
    });

    this.logger.log(`Starting app ${appMetaData.name}@${appMetaData.version}`);
  }

  public async stopApp() {
    if (this.isRunning()) {
      this.appInstance.close();
      const appMetaData = this.appInstance.appMetaData;
      this.logger.log(`Stopped app ${appMetaData.name}@${appMetaData.version}`);
    }
  }
}
