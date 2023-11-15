import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import path = require('path');
import { appRoot } from 'storage.path';

export const appConfiguration = registerAs('app', () => {
  return {
    get env(): string {
      if (process.env['NODE_ENV'] === undefined) {
        process.env['NODE_ENV'] = 'development';
      }
      return process.env['NODE_ENV'];
    },
    protocol: process.env['APP_PROTOCOL'] || 'http',
    host: process.env['APP_HOST'] || 'localhost',
    port: Number(process.env['APP_PORT']) || 3000,
    get domain(): string {
      return `${this.protocol}://${this.host}:${this.port}`;
    },
    screenWidth: Number(process.env['APP_SCREEN_WIDTH']) || 64,
    screenHeight: Number(process.env['APP_SCREEN_HEIGHT']) || 16,
    appStorageDirName: process.env['APP_LOCAL_STORE_PATH'] || 'storage',
    get appStoragePath(): string {
      if (this.env === 'production') {
        return path.join(appRoot, this.appStorageDirName);
      } else {
        return path.resolve(this.appStorageDirName);
      }
    },
  };
});

export type AppConfiguration = ConfigType<typeof appConfiguration>;

export const InjectAppConfig = () => Inject(appConfiguration.KEY);
