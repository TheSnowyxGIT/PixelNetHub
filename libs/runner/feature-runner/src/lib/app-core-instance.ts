import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { EventEmitter } from 'events';
import { AppMetadata } from 'pixel-nethub-core/dist';
import { readFileSync } from 'fs';
import { AppLogger } from 'libs/apps/feature-app-logger/src';
import { v4 } from 'uuid';

type LoggerBuilder = (
  appMetaData: AppMetadata,
  appInstanceId: string,
) => AppLogger;

export class AppCoreInstance extends EventEmitter {
  static create(
    appMetaData: AppMetadata,
    appPath: string,
    loggerBuilder: LoggerBuilder,
  ) {
    return new AppCoreInstance(appMetaData, appPath, loggerBuilder);
  }

  public readonly id: string;
  private readonly appLogger: AppLogger;

  private lastLogs: string[] = [];

  private child: ChildProcessWithoutNullStreams;
  public running = true;
  public returnCode: number | null = null;
  public startDate = new Date();
  public endDate: Date | null = null;
  private constructor(
    public readonly appMetaData: AppMetadata,
    private readonly appPath: string,
    private readonly loggerBuilder: LoggerBuilder,
  ) {
    super();
    this.id = `${v4()}`;
    this.appLogger = this.loggerBuilder(appMetaData, this.id);
    this.child = spawn('npx', [
      'pnh-core',
      'run',
      this.appMetaData.appPath,
      '-c',
      this.appPath,
      '--not-open-browser',
    ]);
    this.child.on('close', (code) => {
      this.running = false;
      this.returnCode = code ?? 0;
      this.endDate = new Date();
      this.emit('close');
    });
    this.child.stdout.on('data', (data) => {
      this.appLogger.write(data);
      this.lastLogs.push(data.toString());
    });
    this.child.stderr.on('data', (data) => {
      this.appLogger.write(data);
      this.lastLogs.push(data.toString());
    });
    this.appLogger.on('rotate', (oldFile: string) => {
      this.lastLogs = [readFileSync(oldFile, 'utf-8')];
    });
  }

  close() {
    this.child.kill();
  }
}
