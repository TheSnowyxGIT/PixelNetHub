import { object, string } from 'yup';
import AppFileParser from './file-parser';
import semver = require('semver');
import { AppCheckerError } from '../errors/AppCheckerError';

export interface AppPackageJson {
  name: string;
  version: string;
}

export class AppPackageJsonParser extends AppFileParser<AppPackageJson> {
  filePath = 'package.json';
  schema = object({
    name: string().required(),
    version: string().required(),
  });
  async customValidate(content: AppPackageJson): Promise<AppPackageJson> {
    content.version = semver.clean(content.version);
    if (!content.version) {
      throw new AppCheckerError('Invalid version format');
    }
    return content;
  }
}
