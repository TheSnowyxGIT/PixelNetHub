import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const appsConfiguration = registerAs('apps', () => {
  return {
    appsAwsBucket: process.env['APPS_AWS_BUCKET'] ?? 'pixel-nethub-apps-bucket',
    appsLocalDir: process.env['APPS_LOCAL_DIR'] ?? 'stored-apps',
    appsLocalRunnerDir: process.env['APPS_LOCAL_DIR'] ?? 'stored-runner-app',
  };
});

export type AppsConfiguration = ConfigType<typeof appsConfiguration>;

export const InjectAppsConfig = () => Inject(appsConfiguration.KEY);
