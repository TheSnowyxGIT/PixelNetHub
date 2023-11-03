import { JSZipObject } from 'jszip';
import { AppCheckerError } from '../errors/AppCheckerError';
import fs = require('fs');
import JSZip = require('jszip');
import { Schema } from 'yup';
import path = require('path');

export default abstract class AppFileParser<T> {
  abstract filePath: string;
  abstract schema: Schema<any>;

  abstract customValidate(content: T): Promise<T>;
  async validate(targetPath: string): Promise<T> {
    const stats = fs.statSync(targetPath);
    let filePath;
    let zip: JSZip | null = null;
    if (stats.isDirectory()) {
      filePath = path.join(targetPath, this.filePath);
    } else if (stats.isFile()) {
      try {
        zip = await JSZip.loadAsync(fs.readFileSync(targetPath));
      } catch (e) {
        throw new AppCheckerError(`File ${this.filePath} is not valid zip`);
      }
    } else {
      throw new AppCheckerError(`File or Directory ${this.filePath} not found`);
    }
    let zipObj: JSZipObject | null = null;
    if (zip) {
      zipObj = zip.file(this.filePath);
      if (!zipObj) {
        throw new AppCheckerError(`File ${this.filePath} not found in zip`);
      }
    } else {
      if (!fs.existsSync(filePath)) {
        throw new AppCheckerError(`File ${this.filePath} not found`);
      }
    }
    const content = zipObj
      ? await zipObj.async('string')
      : fs.readFileSync(filePath, 'utf-8');
    let jsonContent;
    try {
      jsonContent = JSON.parse(content);
    } catch (e) {
      throw new AppCheckerError(`File ${this.filePath} is not valid JSON`);
    }
    return await this.schema.validate(jsonContent);
  }
}
