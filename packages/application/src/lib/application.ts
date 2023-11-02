import { EventEmitter } from 'events';
import path = require('path');
import { IFontService } from './interfaces';
import { IScreenService } from './interfaces/iScreenService';
import { AppError } from './errors/AppError';
import { checkApp } from './checker/app-checker';

export interface AppStartParams {
  options: any;
  screenService: IScreenService;
  fontsService: IFontService;
}

type AppBaseConstructor = new (context: AppStartParams) => AppBase;
abstract class AppBase implements AppStartParams {
  constructor(context: AppStartParams) {
    this.options = context.options;
    this.screenService = context.screenService;
    this.fontsService = context.fontsService;
  }
  options: any;
  screenService: IScreenService;
  fontsService: IFontService;

  abstract onStart(): Promise<void> | void;
  abstract onStop(): Promise<void> | void;
}

export class AppInstance {
  static async create(appPath: string) {
    checkApp(appPath);
    const instance = new AppInstance(appPath);
    await instance.loadApp();
    return instance;
  }

  private appBaseInstance: AppBase | null = null;
  private appConstructor?: AppBaseConstructor;
  private deleteOnStop = false;

  private constructor(private readonly appPath: string) {}

  async loadApp() {
    let importedObj: any;
    try {
      importedObj = await import(path.resolve(this.appPath));
    } catch (e) {
      throw new Error('Error loading app');
    }
    if (importedObj && importedObj.default) {
      importedObj = importedObj.default;
    }
    this.appConstructor = importedObj as AppBaseConstructor;
  }

  start(context: AppStartParams) {
    if (this.appBaseInstance !== null) {
      return;
    }
    if (!this.appConstructor) {
      throw new AppError('App not loaded');
    }
    this.appBaseInstance = new this.appConstructor(context);
    this.appBaseInstance.onStart();
  }

  stop() {
    if (this.appBaseInstance === null) {
      return;
    }
    if (!this.appConstructor) {
      throw new AppError('App not loaded');
    }
    this.appBaseInstance.onStop();
    this.appBaseInstance = null;
  }
}
