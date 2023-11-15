import { Injectable, Logger } from '@nestjs/common';
import { AppMetadata } from 'pixel-nethub-core';
import * as FileStreamRotator from 'file-stream-rotator';
import { mkdirSync, readdirSync, rmSync, statSync, unlinkSync } from 'fs';
import {
  AppConfiguration,
  InjectAppConfig,
} from 'libs/config/utils-config/src';
import path = require('path');

@Injectable()
export class FeatureAppLoggerService {
  private logger = new Logger(FeatureAppLoggerService.name);

  private logsDirName = 'logs';
  private logsPath: string;
  private logRetentionPeriod = 1; // in minutes

  constructor(@InjectAppConfig() private readonly appConfig: AppConfiguration) {
    this.logsPath = path.join(appConfig.appStoragePath, this.logsDirName);
    mkdirSync(this.logsPath, { recursive: true });
  }

  public removeOldLogs() {
    this.logger.log(`Searching for old logs`);
    const files = readdirSync(this.logsPath);
    let count = 0;
    for (const file of files) {
      const appPath = path.join(this.logsPath, file);
      const stat = statSync(appPath);
      if (stat.isDirectory()) {
        const files = readdirSync(appPath);
        let maxMTime = stat.mtime.getTime();
        for (const file of files) {
          const filePath = path.join(appPath, file);
          const stat = statSync(filePath);
          maxMTime = Math.max(maxMTime, stat.mtime.getTime());
        }
        console.log(maxMTime);
        const now = new Date();
        const diff = now.getTime() - maxMTime;
        const diffMinutes = Math.floor(diff / 1000 / 60);
        if (diffMinutes > this.logRetentionPeriod) {
          this.logger.log(`Removing old logs for ${file}`);
          rmSync(appPath, { recursive: true });
          count++;
        }
      }
    }
    if (count === 0) {
      this.logger.log(`No logs removed`);
    }
  }

  public getStreamRotator(appMetaData: AppMetadata) {
    const date = Date.now();
    const dir = `${this.logsPath}/${date}-${appMetaData.name}@${appMetaData.version}`;
    mkdirSync(dir, { recursive: true });
    const rotatingLogStream = FileStreamRotator.getStream({
      filename: `${dir}/${appMetaData.name}`,
      size: '100k',
      max_logs: '10',
      audit_file: `${dir}/audit.json`,
      extension: '.log',
    });
    return rotatingLogStream;
  }
}
