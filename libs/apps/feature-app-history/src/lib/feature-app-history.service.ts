import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { FeatureAppLoggerService } from 'libs/apps/feature-app-logger/src';
import {
  AppConfiguration,
  InjectAppConfig,
} from 'libs/config/utils-config/src';
import { AppCoreInstance } from 'libs/runner/feature-runner/src';
import path = require('path');

export interface HistoryEntry {
  id: string;
  name: string;
  version: string;
  success: boolean;
  startDate: string;
  endDate: string;
}

export type HistoryEntryPopulate = HistoryEntry & {
  logsAvailable: boolean;
};

@Injectable()
export class FeatureAppHistoryService {
  private logger = new Logger(FeatureAppHistoryService.name);

  private historyFileName = 'history.json';
  private historyFilePath: string;

  private history: Record<string, HistoryEntry> = {};
  private historyRetentionPeriod = 7; // in days

  constructor(
    @InjectAppConfig() private readonly appConfig: AppConfiguration,
    private readonly appLoggerService: FeatureAppLoggerService,
  ) {
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
    Object.keys(this.history).forEach((key) => {
      const entry = this.history[key];
      const startDate = new Date(entry.startDate);
      if (startDate.getTime() < diff) {
        delete this.history[key];
      }
    });
    this.save();
  }

  private loadHistory() {
    if (!existsSync(this.historyFilePath)) {
      this.history = {};
      this.save();
    } else {
      this.logger.log(`Loading history from ${this.historyFilePath}`);
      const data = readFileSync(this.historyFilePath, 'utf8');
      const history = JSON.parse(data);
      this.history = history;
    }
  }

  public getAllHistory(): HistoryEntry[] {
    return Object.values(this.history);
  }

  public getHistoryForApp(name: string): HistoryEntry[] {
    return this.getAllHistory().filter((entry) => entry.name === name);
  }

  public getHistoryForAppVersion(
    name: string,
    version: string,
  ): HistoryEntry[] {
    return this.getAllHistory().filter(
      (entry) => entry.name === name && entry.version === version,
    );
  }

  public populateHistoryEntry(
    historyEntry: HistoryEntry,
  ): HistoryEntryPopulate {
    const logsAvailable = this.appLoggerService.appLogsExists(historyEntry.id);
    return { ...historyEntry, logsAvailable };
  }

  public sortHistoryEntries(historyEntries: HistoryEntry[]): HistoryEntry[] {
    return historyEntries.sort((a, b) => {
      const aDate = new Date(a.startDate);
      const bDate = new Date(b.startDate);
      return bDate.getTime() - aDate.getTime();
    });
  }

  public addHistoryEntry(entry: AppCoreInstance) {
    this.logger.log(`Adding history entry for ${entry.appMetaData.name}`);
    this.history[entry.id] = {
      id: entry.id,
      name: entry.appMetaData.name,
      version: entry.appMetaData.version,
      success: entry.returnCode === 0,
      startDate: entry.startDate.toISOString(),
      endDate: entry.endDate.toISOString(),
    };
    this.removeOldEntries();
  }
}
