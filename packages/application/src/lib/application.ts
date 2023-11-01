import { EventEmitter } from 'events';
import { checkApp } from './app-checker';
import { OptionValidator, TypesManager } from 'pixel-nethub-options';
import path = require('path');
import { IFontService } from './interfaces';
import { IScreenService } from './interfaces/iScreenService';
import { existsSync } from 'fs';

export interface AppStartParams {
  options: any;
  screenService: IScreenService;
  fontsService: IFontService;
}

export interface AppInterface {
  start(context: AppStartParams): void;
  stop(): Promise<void>;
}

export class APP extends EventEmitter {
  private appImported?: AppInterface;
  constructor(private readonly appPath: string) {
    super();
  }

  async validateStructureApp() {
    await checkApp(this.appPath);
  }

  async validateOptionsApp(option: any, typeManager: TypesManager) {
    if (!option) {
      return;
    }
    const optionSchema = await this.getOptionSchema();
    const optionsValidator = new OptionValidator(
      option,
      optionSchema,
      typeManager,
    );
    await optionsValidator.validate();
  }

  async getOptionSchema() {
    const optionsPath = path.join(this.appPath, 'options.json');
    const optionSchema = await import(optionsPath);
    return optionSchema;
  }

  async loadApp() {
    const app = await import(path.resolve(this.appPath));
    if (app && !app.start && app.default) {
      this.appImported = app.default as AppInterface;
    } else {
      this.appImported = app as AppInterface;
    }
  }

  private running = false;

  start(context: AppStartParams) {
    if (this.running === true) {
      return;
    }
    this.running = true;
    this.appImported?.start(context);
  }

  stop() {
    if (this.running === false) {
      return;
    }
    this.running = false;
    this.appImported?.stop();
  }
}
