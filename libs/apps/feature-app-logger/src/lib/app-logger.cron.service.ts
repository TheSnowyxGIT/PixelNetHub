import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeatureAppLoggerService } from './feature-app-logger.service';

@Injectable()
export class AppLoggerCronService {
  constructor(private readonly appLoggerService: FeatureAppLoggerService) {
    this.appLoggerService.removeOldLogs();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    this.appLoggerService.removeOldLogs();
  }
}
