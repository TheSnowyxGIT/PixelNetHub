import { Module } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AppLoggerRemoverService } from './app-logger-remover.service';

@Module({
  providers: [AppLoggerService, AppLoggerRemoverService],
  exports: [AppLoggerService],
  controllers: [],
  imports: [ScheduleModule.forRoot()],
})
export class AppLoggerModule {}
