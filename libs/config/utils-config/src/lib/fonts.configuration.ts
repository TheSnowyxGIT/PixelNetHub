import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const fontsConfiguration = registerAs('fonts', () => {
  return {
    fontsAwsBucket:
      process.env['FONTS_AWS_BUCKET'] ?? 'pixel-nethub-fonts-bucket',
    fontsLocalDir: process.env['FONTS_LOCAL_DIR'] ?? 'stored-fonts',
  };
});

export type FontsConfiguration = ConfigType<typeof fontsConfiguration>;

export const InjectFontsConfig = () => Inject(fontsConfiguration.KEY);
