import { Module } from '@nestjs/common';
import { ScreenModule } from './screen/screen.module';
import { ApplicationsModule } from './applications/applications.module';
import { FontsModule } from './fonts/fonts.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationInterceptor } from './validation.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScreenModule,
    ApplicationsModule,
    FontsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ValidationInterceptor,
    },
  ],
})
export class AppModule {}
