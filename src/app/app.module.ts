import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { FeatureConfigModule } from 'libs/config/feature-config/src';
import { FeatureRunnerModule } from 'libs/runner/feature-runner/src';
import { FeatureAppModule } from 'libs/apps/feature-app/src';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationInterceptor } from './validation.interceptor';

@Module({
  imports: [FeatureConfigModule, FeatureRunnerModule, FeatureAppModule],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ValidationInterceptor,
    },
  ],
})
export class AppModule {}
