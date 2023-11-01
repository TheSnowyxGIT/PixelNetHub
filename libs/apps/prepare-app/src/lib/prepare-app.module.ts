import { Module } from '@nestjs/common';
import { PrepareAppService } from './prepare-app.service';

@Module({
  providers: [PrepareAppService],
  exports: [PrepareAppService],
})
export class PrepareAppModule {}
