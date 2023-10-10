import { Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { FontsService } from 'src/fonts/fonts.service';
import { ScreenService } from 'src/screen/screen.service';
import { v4 as uuidv4 } from 'uuid';
import { AppLogger } from '../app-logger/app-logger';
import { AppLoggerService } from '../app-logger/app-logger.service';

export type IApplicationInfo = {
  name: string;
  default?: boolean;
};

export default abstract class IApplication<
  OPTION extends Record<string, any>,
> extends EventEmitter {
  private _id: string;
  private _running = false;

  public get id(): string {
    return this._id;
  }

  protected _logger: AppLogger;
  protected abstract get appLoggerService(): AppLoggerService;

  abstract get info(): IApplicationInfo;
  abstract get defaultOption(): OPTION;
  abstract get options(): OPTION;

  constructor() {
    super();
    this._id = uuidv4();
    this._logger = new AppLogger(this);
  }

  abstract _start(options?: OPTION): Promise<void>;
  public start(options?: OPTION) {
    if (this._running === true) {
      return;
    }
    this._running = true;
    options = { ...this.defaultOption, ...options };
    this._logger.log(`Starting app`);
    this._start(options);
  }
  abstract _stop(): Promise<void>;
  public stop(success = true) {
    if (this._running === false) {
      return;
    }
    this._running = false;
    this._logger.log('Stopping app');
    this.appLoggerService.save(success, this._logger);
    this._stop().then(() => {
      this.emit('close');
    });
  }
}
