import { Injectable } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppLoggerRemoverService {
  constructor(private readonly appLoggerService: AppLoggerService) {}

  @Cron('0 0 * * *')
  removeOldLogs() {
    this.appLoggerService.clearOldLogs();
  }
}
