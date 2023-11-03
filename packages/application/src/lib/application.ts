import path = require('path');
import { AppError } from './errors/AppError';
import { checkApp } from './checker/app-checker';
import { AppBase, AppBaseConstructor, AppStartParams } from './interfaces';
import {
  AppPackageJson,
  AppPackageJsonParser,
} from './parser/packageJson-parser';

export class AppMetadata {
  static async load(appPath: string) {
    await checkApp(appPath);
    const metadata = new AppMetadata(appPath);
    await metadata.loadMetadata();
    return metadata;
  }

  public metadata: AppPackageJson;
  public get name() {
    return this.metadata.name;
  }
  public get version() {
    return this.metadata.version;
  }

  private constructor(public readonly appPath: string) {}
  async loadMetadata() {
    this.metadata = await new AppPackageJsonParser().validate(this.appPath);
  }
}

export class AppInstance {
  static async instantiate(appMetaData: AppMetadata, context: AppStartParams) {
    const instance = new AppInstance(appMetaData);
    await instance.loadApp();
    await instance.start(context);
    return instance;
  }

  private appBaseInstance: AppBase | null = null;
  private appConstructor?: AppBaseConstructor;

  private constructor(private readonly appMetaData: AppMetadata) {}

  async loadApp() {
    let importedObj: any;
    try {
      importedObj = await import(path.resolve(this.appMetaData.appPath));
    } catch (e) {
      throw new AppError('Error loading app');
    }
    if (importedObj && importedObj.default) {
      importedObj = importedObj.default;
    }
    this.appConstructor = importedObj as AppBaseConstructor;
  }

  async start(context: AppStartParams) {
    if (this.appBaseInstance !== null) {
      return;
    }
    if (!this.appConstructor) {
      throw new AppError('App not loaded');
    }
    this.appBaseInstance = new this.appConstructor();
    Object.assign(this.appBaseInstance, context);
    await this.appBaseInstance.onStart();
  }

  async stop() {
    if (this.appBaseInstance === null) {
      return;
    }
    if (!this.appConstructor) {
      throw new AppError('App not loaded');
    }
    await this.appBaseInstance.onStop();
    this.appBaseInstance = null;
  }
}
