import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  InjectAppsConfig,
  AppsConfiguration,
  InjectAppConfig,
  AppConfiguration,
} from 'libs/config/utils-config/src';
import path = require('path');
import fs = require('fs');
import decompress = require('decompress');
import semver = require('semver');
import * as core from 'pixel-nethub-core';
import { App } from './model/App';

@Injectable()
export class FeatureAppService {
  private logger = new Logger(FeatureAppService.name);
  private readonly applications: Map<string, Map<string, core.AppMetadata>> =
    new Map();

  private appStoragePath: string;

  constructor(
    @InjectAppsConfig() private readonly appsConfig: AppsConfiguration,
    @InjectAppConfig() private readonly appConfig: AppConfiguration,
  ) {
    this.appStoragePath = path.join(
      appConfig.appStoragePath,
      appsConfig.appsStoreDirName,
    );
    fs.mkdirSync(this.appStoragePath, { recursive: true });
    this.loadApps();
  }

  private async loadApps(): Promise<void> {
    const files = fs.readdirSync(this.appStoragePath);
    this.logger.log(`Loading apps (Found ${files.length} apps)`);
    for (const file of files) {
      const appPath = path.join(this.appStoragePath, file);
      let appMetaData: core.AppMetadata;
      try {
        appMetaData = await core.AppMetadata.load(appPath);
      } catch (e) {
        this.logger.error(`Error loading app ${file}`);
        continue;
      }
      if (!this.applications.has(appMetaData.name)) {
        this.applications.set(appMetaData.name, new Map());
      }
      const appVersions = this.applications.get(appMetaData.name);
      appVersions.set(appMetaData.version, appMetaData);
      this.logger.log(`${appMetaData.name} OK`);
    }
  }

  async addApp(zipPath: string): Promise<core.AppMetadata> {
    const appMetaData = await core.AppMetadata.load(zipPath);
    const appName = appMetaData.name;
    const appVersion = appMetaData.version;
    const appDirName = `${appName}-${appVersion}`;

    let appVersions = this.applications.get(appName);
    if (appVersions && appVersions.has(appVersion)) {
      throw new Error('App already exists');
    }
    const distPath = path.join(this.appStoragePath, appDirName);

    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, { recursive: true, force: true });
    }

    await decompress(zipPath, distPath);
    if (!this.applications.has(appName)) {
      this.applications.set(appName, new Map());
    }
    appVersions = this.applications.get(appName);
    appVersions.set(appVersion, appMetaData);
    return appMetaData;
  }

  async removeApp(name: string, version: string): Promise<void> {
    const appDirName = `${name}-${version}`;
    const appVersions = this.applications.get(name);
    if (!appVersions || !appVersions.has(version)) {
      throw new NotFoundException();
    }
    appVersions.delete(version);
    const distPath = path.join(this.appStoragePath, appDirName);
    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, { recursive: true, force: true });
    }
  }

  async removeAppAllVersions(name: string): Promise<void> {
    const appVersions = this.applications.get(name);
    if (!appVersions) {
      throw new NotFoundException();
    }
    for (const [version] of appVersions) {
      await this.removeApp(name, version);
    }
  }

  async getApp(
    name: string,
    version: string,
  ): Promise<core.AppMetadata | null> {
    const appVersions = this.applications.get(name);
    if (!appVersions || !appVersions.has(version)) {
      return null;
    }
    return appVersions.get(version);
  }

  async getAppLatest(name: string) {
    const appVersions = this.applications.get(name);
    if (!appVersions) {
      return null;
    }
    const versions = Array.from(appVersions.keys());
    const latest = semver.maxSatisfying(versions, '*');
    if (!latest) {
      return null;
    }
    return appVersions.get(latest);
  }

  async getApps(): Promise<core.AppMetadata[]> {
    const apps: core.AppMetadata[] = [];
    for (const appVersions of this.applications.values()) {
      for (const app of appVersions.values()) {
        apps.push(app);
      }
    }
    return apps;
  }

  async getAppsGroupByVersion(): Promise<App[]> {
    const apps: App[] = [];
    for (const [name, appVersions] of this.applications.entries()) {
      apps.push({
        name,
        versions: Array.from(appVersions.keys()),
      });
    }
    return apps;
  }

  async getAppGroupByVersion(name: string): Promise<App> {
    const appVersions = this.applications.get(name);
    if (!appVersions) {
      return null;
    }
    return {
      name,
      versions: Array.from(appVersions.keys()),
    };
  }
}
