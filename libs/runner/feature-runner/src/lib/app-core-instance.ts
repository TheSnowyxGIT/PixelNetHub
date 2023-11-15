import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { EventEmitter } from 'events';
import { AppMetadata } from 'pixel-nethub-core/dist';
import FileStreamRotator from 'file-stream-rotator/lib/FileStreamRotator';
import { readFileSync } from 'fs';
import { AppLogger } from 'libs/apps/feature-app-logger/src';

export class AppCoreInstance extends EventEmitter {
  static create(
    appMetaData: AppMetadata,
    appPath: string,
    streamRotator: AppLogger,
  ) {
    return new AppCoreInstance(appMetaData, appPath, streamRotator);
  }

  private lastLogs: string[] = [];

  private child: ChildProcessWithoutNullStreams;
  public running = true;
  public returnCode: number | null = null;
  public startDate = new Date();
  public endDate: Date | null = null;
  public get logsDir() {
    return this.streamRotator.logsDir;
  }
  private constructor(
    public readonly appMetaData: AppMetadata,
    private readonly appPath: string,
    private readonly streamRotator: AppLogger,
  ) {
    super();
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
      this.streamRotator.write(data);
      this.lastLogs.push(data.toString());
    });
    this.child.stderr.on('data', (data) => {
      this.streamRotator.write(data);
      this.lastLogs.push(data.toString());
    });
    this.streamRotator.on('rotate', (oldFile: string) => {
      this.lastLogs = [readFileSync(oldFile, 'utf-8')];
    });
  }

  close() {
    this.child.kill();
  }
}
