import fs = require('fs');
import path = require('path');
import { AppCheckerError } from '../errors/AppCheckerError';
import JSZip = require('jszip');
import AppFileParser from '../parser/file-parser';
import { AppPackageJsonParser } from '../parser/packageJson-parser';

const filesToCheck: AppFileParser<any>[] = [new AppPackageJsonParser()];

export async function checkAppFromZip(zipPath: string) {
  if (!fs.existsSync(zipPath)) throw new AppCheckerError('File not found');

  for (const file of filesToCheck) {
    await file.validate(zipPath);
  }
}

export async function checkAppFromDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) throw new AppCheckerError('App dir not found');
  const stat = fs.statSync(dirPath);
  if (!stat.isDirectory()) throw new AppCheckerError('App dir not found');

  for (const file of filesToCheck) {
    await file.validate(dirPath);
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
