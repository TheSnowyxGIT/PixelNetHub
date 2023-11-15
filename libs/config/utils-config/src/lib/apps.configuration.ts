import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const appsConfiguration = registerAs('apps', () => {
  return {
    appsStoreDirName: process.env['APPS_LOCAL_DIR'] ?? 'apps',
  };
});

export type AppsConfiguration = ConfigType<typeof appsConfiguration>;

export const InjectAppsConfig = () => Inject(appsConfiguration.KEY);
