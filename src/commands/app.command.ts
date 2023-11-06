import { Command, SubCommand, Option } from 'nest-commander';
import { CommandRunnerWithNestLogger } from './utils/command-runner-nest-logger.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app/app.module';
import { FeatureAppService } from 'libs/apps/feature-app/src';
import { FeatureRunnerService } from 'libs/runner/feature-runner/src';

@SubCommand({
  name: 'install',
  arguments: '<appPath>',
  description: 'Install an application',
  options: { isDefault: false },
})
export class AppInstallCommand extends CommandRunnerWithNestLogger {
  constructor() {
    super(AppInstallCommand.name);
  }

  async run(passedParams: string[]) {
    const [appPath] = passedParams;
    if (!appPath) {
      throw new Error('Missing app path');
    }
    const app = await NestFactory.create(AppModule);
    const appService = app.get(FeatureAppService);
    this.logger.log(`Installing app from path: ${appPath}`);
    const appMetaData = await appService.addApp(appPath);
    this.logger.log(`App ${appMetaData.name}-${appMetaData.version} installed`);
    app.close();
  }
}

@SubCommand({
  name: 'run',
  arguments: '<appName>',
  description: 'Run an application',
  options: { isDefault: false },
})
export class AppStartCommand extends CommandRunnerWithNestLogger {
  constructor() {
    super(AppStartCommand.name);
  }

  async run(passedParams: string[], options: { version?: string }) {
    const [appName] = passedParams;
    if (!appName) {
      throw new Error('Missing app name');
    }
    const app = await NestFactory.create(AppModule);
    const runnerService = app.get(FeatureRunnerService);
    await runnerService.startFromDownloadedApps(appName, options.version);
  }

  @Option({
    flags: '--version [version]',
    required: false,
  })
  parseVersion(version: string): string {
    return version;
  }
}

@Command({
  name: 'app',
  description: 'App management commands.',
  subCommands: [AppInstallCommand, AppStartCommand],
})
export class AppCommand extends CommandRunnerWithNestLogger {
  constructor() {
    super(AppCommand.name);
  }
  async run(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const appService = app.get(FeatureAppService);
    const apps = await appService.getApps();
    console.log('Displaying apps');
    for (const app of apps) {
      console.log(`\t${app.name} - ${app.version}`);
    }
    await app.close();
  }
}
