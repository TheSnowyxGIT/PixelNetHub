import { Logger } from '@nestjs/common';
import IApplication from '../apps/IApplication';
import * as path from 'path';
import * as fs from 'fs';
import { AppLoggerService } from './app-logger.service';

export class AppLogger {
  public app: IApplication<any>;
  private buffer: string[] = [];
  public file: string;
  private flushIntervalCount = 10;
  private count = 0;
  private logger = new Logger(AppLogger.name);
  constructor(app: IApplication<any>) {
    this.app = app;
    this.file = path.resolve(AppLoggerService.LOGS_DIR, `${this.app.id}.log`);
  }

  private prefix(): string {
    return `[${this.app.info.name}] ${
      this.app.id
    } - ${new Date().toISOString()} `;
  }

  private prefix_stdout(): string {
    return `[${this.app.info.name}] ${this.app.id} - `;
  }

  private typeWidth = 7;

  private push(message: string) {
    this.buffer.push(message);
    if (this.count++ > this.flushIntervalCount) {
      this.flush();
      this.count = 0;
    }
  }

  public log(message: any) {
    this.push(
      `${this.prefix()}${'INFO'.padStart(this.typeWidth, ' ')} ${message}`,
    );
    this.logger.log(`${this.prefix_stdout()}${message}`);
  }

  public error(message: any) {
    this.push(
      `${this.prefix()}${'ERROR'.padStart(this.typeWidth, ' ')} ${message}`,
    );
    this.logger.error(`${this.prefix_stdout()}${message}`);
  }

  public warn(message: any) {
    this.push(
      `${this.prefix()}${'WARN'.padStart(this.typeWidth, ' ')} ${message}`,
    );
    this.logger.warn(`${this.prefix_stdout()}${message}`);
  }

  public flush() {
    if (this.buffer.length === 0) {
      return;
    }
    fs.appendFileSync(this.file, this.buffer.join('\n'));
    this.buffer = [];
  }
}
