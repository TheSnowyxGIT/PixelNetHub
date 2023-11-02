import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeatureConfigModule } from 'libs/config/feature-config/src';
import { RunCommand } from './run.command';

@Module({
  imports: [FeatureConfigModule],
  providers: [RunCommand],
  controllers: [],
  exports: [],
})
export class CommandsModule {}
