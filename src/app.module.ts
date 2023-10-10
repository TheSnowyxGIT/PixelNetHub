import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScreenModule } from './screen/screen.module';
import { ApplicationsModule } from './applications/applications.module';
import { FontsModule } from './fonts/fonts.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScreenModule,
    ApplicationsModule,
    FontsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
