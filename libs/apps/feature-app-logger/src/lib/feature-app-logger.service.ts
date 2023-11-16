import { Injectable, Logger } from '@nestjs/common';
import { AppMetadata } from 'pixel-nethub-core';
import FileStreamRotator from 'file-stream-rotator/lib/FileStreamRotator';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  unlinkSync,
} from 'fs';
import {
  AppConfiguration,
  InjectAppConfig,
} from 'libs/config/utils-config/src';
import path = require('path');

export type AppLogger = FileStreamRotator & { logsDir: string };

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

  public appLogsExists(appInstanceId: string): boolean {
    const appPath = path.join(this.logsPath, appInstanceId);
    if (!existsSync(appPath)) {
      return false;
    }
    return statSync(appPath).isDirectory();
  }

  public getLogsFiles(appInstanceId: string): string[] {
    const logsDirPath = path.join(this.logsPath, appInstanceId);
    let logFiles = readdirSync(logsDirPath);
    logFiles = logFiles.filter((file) => file.endsWith('.log'));
    logFiles = logFiles.map((file) => path.join(logsDirPath, file));
    return logFiles;
  }

  public getStreamRotator(
    appMetaData: AppMetadata,
    appInstanceId: string,
  ): AppLogger {
    const dir = `${this.logsPath}/${appInstanceId}`;
    mkdirSync(dir, { recursive: true });
    const rotatingLogStream = FileStreamRotator.getStream({
      filename: `${dir}/${appMetaData.name}`,
      size: '100k',
      max_logs: '10',
      audit_file: `${dir}/audit.json`,
      extension: '.log',
    });
    return Object.assign(rotatingLogStream, { logsDir: dir });
  }
}
