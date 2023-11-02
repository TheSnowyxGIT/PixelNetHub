import { Logger } from '@nestjs/common';
import { CommandRunner } from 'nest-commander';
import { Command } from 'nest-commander/node_modules/commander';

export abstract class CommandRunnerWithNestLogger extends CommandRunner {
  protected readonly logger: Logger;

  constructor(className: string) {
    super();
    this.logger = new Logger(className);
  }

  public override setCommand(command: Command): this {
    this.command = command;
    this.command.configureOutput({
      outputError: (str: string) => {
        this.logger.error(str);
      },
    });
    return this;
  }
}
