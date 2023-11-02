import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RunnerAppNotFoundError } from './errors/RunnerError';
import { FeatureAppService } from 'libs/apps/feature-app/src';
import { PrepareAppService } from 'libs/apps/prepare-app/src';
import { FeatureFontPublicService } from 'libs/fonts/feature-font/src';
import { FeatureScreenService } from 'libs/screen/feature-screen/src';
import * as application from 'packages/application/src';

@Injectable()
export class FeatureRunnerService {
  private currentApplication: application.APP | null = null;
  constructor(
    private readonly appsService: FeatureAppService,
    private readonly appsPrepare: PrepareAppService,
    private readonly moduleRef: ModuleRef,
  ) {}

  private isRunning() {
    return this.currentApplication !== null;
  }

  async startLocalApp(appPath: string) {
    this.currentApplication = new application.APP(appPath);
    await this.currentApplication.loadApp();
    // Stop the previous app
    if (this.isRunning()) {
      await this.stopApp();
    }

    this.currentApplication.start({
      options: {},
      fontsService: this.moduleRef.get(FeatureFontPublicService, {
        strict: false,
      }),
      screenService: this.moduleRef.get(FeatureScreenService, {
        strict: false,
      }),
    });
  }

  async startApp(appName: string, options?: any) {
    const app = await this.appsService.getApp(appName);
    if (!app) {
      throw new RunnerAppNotFoundError(appName);
    }
    // const appPath = await this.appsPrepare.prepareApp(app);
    const appPath = '';

    // Load the new app
    this.currentApplication = new application.APP(appPath);
    // await this.currentApplication.validateStructureApp();
    // await this.currentApplication.validateOptionsApp(
    //   options,
    //   this.utilsTypeManagerService.getTypesManager()
    // );
    await this.currentApplication.loadApp();

    // Stop the previous app
    if (this.isRunning()) {
      await this.stopApp();
    }

    this.currentApplication.start({
      options: options || {},
      fontsService: this.moduleRef.get(FeatureFontPublicService, {
        strict: false,
      }),
      screenService: this.moduleRef.get(FeatureScreenService, {
        strict: false,
      }),
    });
  }

  public async stopApp() {
    if (this.isRunning()) {
      this.currentApplication?.stop();
    }
  }
}
