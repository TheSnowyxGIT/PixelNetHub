import { Body, Controller, Get, Post } from '@nestjs/common';
import { IApplicationInfo } from './apps/IApplication';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationService: ApplicationsService) {}

  @Get()
  public getApplications(): IApplicationInfo[] {
    return this.applicationService.getApplications();
  }

  @Get('current')
  public getCurrentApplication(): IApplicationInfo | null {
    return this.applicationService.currentApplication.info;
  }

  @Post()
  public async startApp(
    @Body('app') app: string,
    @Body('options') options?: any,
  ) {
    console.log(app, options);
    await this.applicationService.startApp(app, options);
  }

  @Post('stop')
  public async stopApp() {
    await this.applicationService.stopApp();
  }
}
