import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataAccessAppsDataRepository } from './data-access-apps-data.repository';
import { AppData, AppDataSchema } from './data-access-apps-data.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AppData.name, schema: AppDataSchema }]),
  ],
  providers: [DataAccessAppsDataRepository],
  exports: [DataAccessAppsDataRepository],
})
export class DataAccessAppsDataModule {}
