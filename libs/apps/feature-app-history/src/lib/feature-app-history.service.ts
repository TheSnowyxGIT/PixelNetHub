import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import {
  AppConfiguration,
  InjectAppConfig,
} from 'libs/config/utils-config/src';
import { AppCoreInstance } from 'libs/runner/feature-runner/src';
import path = require('path');

export interface HistoryEntry {
  name: string;
  version: string;
  success: boolean;
  startDate: string;
  endDate: string;
  logs: string;
}

@Injectable()
export class FeatureAppHistoryService {
  private logger = new Logger(FeatureAppHistoryService.name);

  private historyFileName = 'history.json';
  private historyFilePath: string;

  private history: HistoryEntry[] = [];
  private historyRetentionPeriod = 1 / 24 / 60 / 2; // in days

  constructor(@InjectAppConfig() private readonly appConfig: AppConfiguration) {
    this.historyFilePath = path.join(
      this.appConfig.appStoragePath,
      this.historyFileName,
    );
    this.loadHistory();
    this.removeOldEntries();
  }

  save() {
    mkdirSync(path.dirname(this.appConfig.appStoragePath), { recursive: true });
    writeFileSync(this.historyFilePath, JSON.stringify(this.history, null, 2));
  }

  private removeOldEntries() {
    const now = new Date();
    const diff =
      now.getTime() - this.historyRetentionPeriod * 24 * 60 * 60 * 1000;
    const diffDate = new Date(diff);
    this.logger.log(`Removing old history entries before ${diffDate}`);
    this.history = this.history.filter((entry) => {
      const startDate = new Date(entry.startDate);
      return startDate.getTime() > diff;
    });
    this.save();
  }

  private loadHistory() {
    if (!existsSync(this.historyFilePath)) {
      this.history = [];
      this.save();
    } else {
      this.logger.log(`Loading history from ${this.historyFilePath}`);
      const data = readFileSync(this.historyFilePath, 'utf8');
      const history = JSON.parse(data);
      this.history = history;
    }
  }

  public addHistoryEntry(entry: AppCoreInstance) {
    this.logger.log(`Adding history entry for ${entry.appMetaData.name}`);
    this.history.unshift({
      name: entry.appMetaData.name,
      version: entry.appMetaData.version,
      success: entry.returnCode === 0,
      startDate: entry.startDate.toISOString(),
      endDate: entry.endDate.toISOString(),
      logs: entry.logsDir,
    });
    this.removeOldEntries();
  }
}
