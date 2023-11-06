import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RunnerAppNotFoundError } from './errors/RunnerError';
import { FeatureAppService } from 'libs/apps/feature-app/src';
import * as core from 'pixel-nethub-core';
import { spawn } from 'child_process';

@Injectable()
export class FeatureRunnerService {
  private readonly logger = new Logger(FeatureRunnerService.name);

  private currentApplication?: core.AppMetadata;
  constructor(private readonly appsService: FeatureAppService) {}

  private isRunning(): boolean {
    //todo
    return false;
  }

  async startFromPath(appPath: string) {
    const appMetaData = await core.AppMetadata.load(appPath);
    await this.startAppInstance(appMetaData);
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
    await this.startAppInstance(appMetaData);
  }

  private async startAppInstance(appInstance: core.AppMetadata) {
    // Stop the previous app
    if (this.isRunning()) {
      await this.stopApp();
    }

    const appProcess = spawn(
      'npx',
      ['pnh-core', 'run', appInstance.appPath],
      {},
    );
    appProcess.stdout.on('data', (data) => {
      process.stdout.write(`app: ${data}`);
    });
    this.logger.log(`Starting app ${appInstance.name}@${appInstance.version}`);
  }

  public async stopApp() {
    if (this.isRunning()) {
      // this.logger.log(
      //   `Stopped app ${this.currentApplication?.appMetaData.name}@${this.currentApplication?.appMetaData.version}`,
      // );
    }
  }
}
