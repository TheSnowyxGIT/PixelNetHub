import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureConfigModule } from 'libs/config/feature-config/src';
import {
  MongoConfiguration,
  mongoConfiguration,
} from 'libs/config/utils-config/src';
import { FeatureFontModule } from 'libs/fonts/feature-font/src';
import { FeatureRunnerModule } from 'libs/runner/feature-runner/src';
import { FeatureScreenModule } from 'libs/screen/feature-screen/src';
import { FeatureAppModule } from 'libs/apps/feature-app/src';

@Module({
  imports: [
    FeatureConfigModule,
    MongooseModule.forRootAsync({
      inject: [mongoConfiguration.KEY],
      useFactory: async (mongoConfig: MongoConfiguration) => {
        return {
          uri: mongoConfig.uri,
          dbName: mongoConfig.dbName,
          user: mongoConfig.user,
          pass: mongoConfig.password,
        };
      },
    }),
    FeatureFontModule,
    FeatureScreenModule,
    FeatureRunnerModule,
    FeatureAppModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
