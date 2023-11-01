import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppData } from './data-access-apps-data.model';

@Injectable()
export class DataAccessAppsDataRepository {
  constructor(@InjectModel(AppData.name) private appModel: Model<AppData>) {}

  async getAll() {
    return await this.appModel.find().exec();
  }

  async get(name: string) {
    return await this.appModel.findOne({ name: name }).exec();
  }

  async getById(id: string) {
    return await this.appModel.findById(id).exec();
  }

  async getAppWithVersion(name: string, version: string) {
    return await this.appModel
      .findOne({ name: name, versions: { $in: [version] } })
      .exec();
  }

  async create(data: Partial<AppData>) {
    const font = new this.appModel(data);
    return await font.save();
  }

  async update(id: string, data: Partial<AppData>) {
    await this.appModel.updateOne({ _id: id }, data).exec();
    const fontData = await this.getById(id);
    if (fontData === null) throw new Error('Font not found after update');
    return fontData;
  }

  async delete(id: string) {
    await this.appModel.deleteOne({ _id: id }).exec();
  }
}
