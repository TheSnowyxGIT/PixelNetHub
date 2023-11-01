import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const awsConfiguration = registerAs('aws', () => {
  return {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'] ?? '',
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] ?? '',
    s3Region: process.env['AWS_S3_REGION'] ?? 'eu-west-3',
  };
});

export type AwsConfiguration = ConfigType<typeof awsConfiguration>;

export const InjectAwsConfig = () => Inject(awsConfiguration.KEY);
