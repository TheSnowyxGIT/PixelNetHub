import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { CommandsModule } from './commands/commands.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const config = app.get<AppConfiguration>(appConfiguration.KEY);
//   const globalPrefix = '';
//   app.setGlobalPrefix(globalPrefix);
//   await app.listen(config.port);
//   Logger.log(`🚀 Application is running on: ${config.domain}/${globalPrefix}`);
// }

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await CommandFactory.createWithoutRunning(CommandsModule, {
    logger,
    serviceErrorHandler: (error) => {
      logger.error(error);
      process.exit(1);
    },
    outputConfiguration: {
      outputError: (output) => {
        logger.error(output);
      },
    },
  });
  await CommandFactory.runApplication(app);
  await app.close();
}

bootstrap();
