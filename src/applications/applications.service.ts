import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import IApplication, { IApplicationInfo } from './apps/IApplication';
import { FontsService } from 'src/fonts/fonts.service';
import { ScreenService } from 'src/screen/screen.service';
import TimeApp from './apps/TimeApp';
import { AppLoggerService } from './app-logger/app-logger.service';

@Injectable()
export class ApplicationsService {
  private logger = new Logger(ApplicationsService.name);
  constructor(
    private readonly fontService: FontsService,
    private readonly screenService: ScreenService,
    private readonly appLoggerService: AppLoggerService,
  ) {
    this.appsSpawner.forEach((appSpawner) => {
      const app = appSpawner();
      this.appsInfoMap.set(app.info.name, app.info);
      this.appsSpawnerMap.set(app.info.name, appSpawner);
    });
    this.logger.log(`Found ${this.appsSpawner.length} apps`);
    this.startApp(this.getDefaultApp());
  }

  private appsSpawner: (() => IApplication<any>)[] = [
    () =>
      new TimeApp(this.fontService, this.screenService, this.appLoggerService),
  ];
  private appsSpawnerMap: Map<string, () => IApplication<any>> = new Map();
  private appsInfoMap: Map<string, IApplicationInfo> = new Map();

  private getDefaultApp(): string {
    const defaultApp = Array.from(this.appsInfoMap.values()).find(
      (app) => app.default,
    );
    if (defaultApp === undefined) {
      throw new Error('No default app found');
    }
    return defaultApp.name;
  }

  public getApplications(): IApplicationInfo[] {
    return Array.from(this.appsInfoMap.values()).map((app) => app);
  }

  public currentApplication: IApplication<any> | null = null;

  public async startApp(app: string, options?: any) {
    const appSpawner = this.appsSpawnerMap.get(app);
    if (appSpawner === undefined) {
      throw new BadRequestException(`App ${app} not found`);
    }
    const hadAppRunning = this.currentApplication !== null;
    const previousApp = this.currentApplication;
    const appInstance = appSpawner();
    this.currentApplication = appInstance;
    if (hadAppRunning) {
      previousApp.stop();
    }
    appInstance.start(options);
    appInstance.on('close', async () => {
      if (this.currentApplication === appInstance) {
        await this.startApp(this.getDefaultApp());
      }
    });
  }

  public async stopApp() {
    if (this.currentApplication !== null) {
      this.currentApplication.stop();
    }
  }
}
