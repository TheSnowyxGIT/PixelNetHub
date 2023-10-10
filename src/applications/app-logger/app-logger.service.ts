import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { AppLogger } from './app-logger';

type LogData = {
  appName: string;
  id: string;
  timestamp: string;
  success: boolean;
  file: string;
};

@Injectable()
export class AppLoggerService {
  public static LOGS_DIR = 'logs';

  private logsConfig = path.resolve(AppLoggerService.LOGS_DIR, 'logs.json');
  private deleteThreshold = 1000 * 60 * 60 * 24 * 7; // 7 days
  private logsData: Map<string, LogData> = new Map();

  constructor() {
    fs.existsSync(this.logsConfig) || this.createLogsConfig();
    const data = JSON.parse(fs.readFileSync(this.logsConfig).toString());
    data.logs.forEach((font: LogData) => {
      this.logsData.set(font.id, font);
    });
    this.clearOldLogs();
  }

  private createLogsConfig() {
    const fontsConfigPath = path.resolve(this.logsConfig);
    const fontsConfigString = JSON.stringify(
      {
        logs: Array.from(this.logsData.values()),
      },
      null,
      2,
    );
    fs.mkdirSync(path.dirname(fontsConfigPath), { recursive: true });
    fs.writeFileSync(fontsConfigPath, fontsConfigString);
  }

  public save(success: boolean, logger: AppLogger) {
    logger.flush();
    const data: LogData = {
      appName: logger.app.info.name,
      id: logger.app.id,
      timestamp: new Date().toISOString(),
      success,
      file: logger.file,
    };
    this.logsData.set(logger.app.id, data);
    this.createLogsConfig();
  }

  public clearOldLogs() {
    const now = new Date().getTime();
    Array.from(this.logsData.values()).forEach((log) => {
      if (now - new Date(log.timestamp).getTime() > this.deleteThreshold) {
        fs.unlinkSync(log.file);
        this.logsData.delete(log.id);
      }
    });
    this.createLogsConfig();
  }
}
