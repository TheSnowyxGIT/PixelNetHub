import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RunnerAppNotFoundError } from './errors/RunnerError';
import { FeatureAppService } from 'libs/apps/feature-app/src';
import { FeatureFontPublicService } from 'libs/fonts/feature-font/src';
import { FeatureScreenService } from 'libs/screen/feature-screen/src';
import * as application from 'packages/application/src';

@Injectable()
export class FeatureRunnerService {
  private currentApplication: application.AppInstance | null = null;
  constructor(
    private readonly appsService: FeatureAppService,
    private readonly moduleRef: ModuleRef,
  ) {}

  private isRunning() {
    return this.currentApplication !== null;
  }

  async startFromPath(appPath: string) {
    const appMetaData = await application.AppMetadata.load(appPath);
    await this.startAppInstance(appMetaData);
  }

  async startFromDownloadedApps(appName: string, version?: string) {
    let app: application.AppMetadata;
    if (!version) {
      app = await this.appsService.getAppLatest(appName);
    } else {
      app = await this.appsService.getApp(appName, version);
    }
    if (!app) {
      throw new RunnerAppNotFoundError(appName);
    }
    const appMetaData = await application.AppMetadata.load(app.appPath);
    await this.startAppInstance(appMetaData);
  }

  private async startAppInstance(appInstance: application.AppMetadata) {
    // Stop the previous app
    if (this.isRunning()) {
      await this.stopApp();
    }

    this.currentApplication = await application.AppInstance.instantiate(
      appInstance,
      {
        options: {},
        fontsService: this.moduleRef.get(FeatureFontPublicService, {
          strict: false,
        }),
        screenService: this.moduleRef.get(FeatureScreenService, {
          strict: false,
        }),
      },
    );
  }

  public async stopApp() {
    if (this.isRunning()) {
      await this.currentApplication?.stop();
    }
  }
}
