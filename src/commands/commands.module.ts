import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeatureConfigModule } from 'libs/config/feature-config/src';
import { RunCommand } from './run.command';
import { AppCommand, AppInstallCommand, AppStartCommand } from './app.command';

@Module({
  imports: [FeatureConfigModule],
  providers: [RunCommand, AppCommand, AppInstallCommand, AppStartCommand],
  controllers: [],
  exports: [],
})
export class CommandsModule {}
