import { Prop, SchemaFactory } from '@nestjs/mongoose';
import SchemaFactoryWithMethods from 'libs/utils/SchemaFactoryWithMethods';

export class AppDataMethods {
  fileName(this: AppData, version: string): string {
    return `${this.name}-${version}.zip`;
  }
}

export class AppData extends AppDataMethods {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;
  @Prop()
  versions: string[];
}

export type AppDataDocument = AppData & Document;

export const AppDataSchema = SchemaFactoryWithMethods.createForClass(
  AppData,
  AppDataMethods,
);
