import { object, string } from 'yup';
import semver = require('semver');
import FileValidator from '../file-validator.class';
import { ValidationError } from '../../errors/AppCheckerError';

export interface PackageJson {
  name: string;
  version: string;
}

export class PackageJsonValidator extends FileValidator<PackageJson> {
  filePath = 'package.json';
  schema = object({
    name: string().required(),
    version: string().required(),
  });
  async customValidate(content: PackageJson): Promise<PackageJson> {
    content.version = semver.clean(content.version);
    if (!content.version) {
      throw new ValidationError('Invalid version format');
    }
    return content;
  }
}
