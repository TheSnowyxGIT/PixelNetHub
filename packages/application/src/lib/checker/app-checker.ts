import fs = require('fs');
import { AppError } from '../errors/AppError';
import path = require('path');
import { AppCheckerError } from '../errors/AppCheckerError';
import JSZip = require('jszip');

type FileCheck = {
  path: string;
  optional?: boolean;
  checker?: (obj: string) => boolean;
};

const neededFiles: FileCheck[] = [
  {
    path: 'package.json',
  },
];

export async function checkAppFromZip(zipPath: string) {
  if (!fs.existsSync(zipPath)) throw new AppCheckerError('File not found');

  // decompress in memory the zip
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(fs.readFileSync(zipPath));
  } catch (e) {
    throw new AppCheckerError('Can not read the zip, is it a zip?');
  }

  const prefix = path.basename(zipPath, '.zip');
  for (const file of neededFiles) {
    const obj = zip.file(`${prefix}/${file.path}`);
    if (!obj && !file.optional) {
      throw new AppCheckerError(`File ${file.path} not found`);
    }
    if (obj && file.checker && !file.checker(await obj.async('string'))) {
      throw new AppCheckerError(`File ${file.path} is not valid`);
    }
  }
}

export async function checkAppFromDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) throw new AppCheckerError('App dir not found');
  const stat = fs.statSync(dirPath);
  if (!stat.isDirectory()) throw new AppCheckerError('App dir not found');

  for (const file of neededFiles) {
    const path = `${dirPath}/${file.path}`;
    const exists = fs.existsSync(path);
    if (!exists && !file.optional) {
      throw new AppCheckerError(`File ${file.path} not found`);
    }
    if (
      exists &&
      file.checker &&
      !file.checker(fs.readFileSync(path, 'utf8'))
    ) {
      throw new AppCheckerError(`File ${file.path} is not valid`);
    }
  }
}

export async function checkApp(appPath: string) {
  if (!fs.existsSync(appPath))
    throw new AppCheckerError('No such file or directory');

  const stat = fs.statSync(appPath);
  if (stat.isDirectory()) {
    await checkAppFromDir(appPath);
  } else {
    await checkAppFromZip(appPath);
  }
}
