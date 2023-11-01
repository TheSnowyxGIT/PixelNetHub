/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import {
  AppConfiguration,
  appConfiguration,
} from 'libs/config/utils-config/src';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<AppConfiguration>(appConfiguration.KEY);
  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);
  await app.listen(config.port);
  Logger.log(`🚀 Application is running on: ${config.domain}/${globalPrefix}`);
}

bootstrap();
