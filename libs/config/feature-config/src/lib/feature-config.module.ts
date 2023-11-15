import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongo } from 'mongoose';
import {
  appConfiguration,
  appsConfiguration,
  fontsConfiguration,
} from 'libs/config/utils-config/src';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration, fontsConfiguration, appsConfiguration],
    }),
  ],
})
export class FeatureConfigModule {}
