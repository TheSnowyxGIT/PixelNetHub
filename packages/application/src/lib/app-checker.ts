import fs = require('fs');
import { AppError } from './errors/AppError';
import path = require('path');

export async function checkApp(appPath: string) {
  if (!fs.existsSync(appPath)) throw new AppError('App not found');
  await checkOptionFile(appPath);

  // try to load it
  try {
    await import(appPath);
  } catch (e) {
    throw new AppError('App not valid');
  }
}

async function checkOptionFile(appPath: string) {
  const optionsPath = path.join(appPath, 'options.json');
  if (!fs.existsSync(optionsPath))
    throw new AppError('OptionsSchema not found');
  try {
    await import(optionsPath);
  } catch (e) {
    throw new AppError('OptionsSchema not valid');
  }
}
