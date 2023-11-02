import { Command, Option } from 'nest-commander';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CommandRunnerWithNestLogger } from './utils/command-runner-nest-logger.interface';
import { AppModule } from 'src/app/app.module';
import {
  AppConfiguration,
  appConfiguration,
} from 'libs/config/utils-config/src';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RunCommandOptions {}

@Command({ name: 'run', description: 'run the API' })
export class RunCommand extends CommandRunnerWithNestLogger {
  constructor() {
    super(RunCommand.name);
  }

  async run(passedParam: string[], options: RunCommandOptions): Promise<void> {
    this.logger.log(`Launching the '${this.command.name()}' command...`);
    const app = await NestFactory.create(AppModule);
    const config = app.get<AppConfiguration>(appConfiguration.KEY);
    const globalPrefix = '';
    app.setGlobalPrefix(globalPrefix);
    await app.listen(config.port);
    this.logger.log(
      `🚀 Application is running on: ${config.domain}/${globalPrefix}`,
    );
  }
}
