import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { Logger } from '@nestjs/common';
import fs = require('fs');
import { AwsConfiguration } from 'libs/config/utils-config/src';
import path = require('path');

export type DataAccessStorageServiceOptions<T> = {
  awsConfig: AwsConfiguration;
  bucketName: string;
  activateAws: boolean;
  localDir: string;
  transform: (buffer: ArrayBuffer) => Promise<T>;
  logger: Logger;
  type: string;
};

export class DataAccessStorageService<T> {
  private readonly s3Client;
  constructor(private readonly options: DataAccessStorageServiceOptions<T>) {
    if (this.options.activateAws) {
      this.s3Client = new S3Client({
        region: this.options.awsConfig.s3Region,
        credentials: {
          accessKeyId: this.options.awsConfig.accessKeyId,
          secretAccessKey: this.options.awsConfig.secretAccessKey,
        },
      });
      this.options.logger.log(
        `AWS is activated for ${this.options.type} storage. with bucket ${this.options.bucketName}`,
      );
    } else {
      this.options.logger.log(
        `AWS is not activated for ${this.options.type} storage`,
      );
    }
  }

  private async getFromAws(fileName: string): Promise<ArrayBuffer | null> {
    try {
      const file = await this.s3Client!.send(
        new GetObjectCommand({
          Bucket: this.options.bucketName,
          Key: fileName,
        }),
      );
      const buffer = await new Response(
        file.Body as ReadableStream,
      ).arrayBuffer();
      return buffer;
    } catch (error) {
      if (error instanceof S3ServiceException) {
        if (error.name === 'NoSuchKey') {
          this.options.logger.error(
            `${this.options.type} ${fileName} not found in bucket ${this.options.bucketName}`,
          );
        } else if (error.name === 'AccessDenied') {
          this.options.logger.error(
            `Access denied to bucket ${this.options.bucketName}`,
          );
        } else if (error.name === 'SignatureDoesNotMatch') {
          this.options.logger.error(
            `Invalid credentials to bucket ${this.options.bucketName}`,
          );
        } else if (error.name === 'NoSuchBucket') {
          this.options.logger.error(
            `Bucket ${this.options.bucketName} does not exist`,
          );
        } else {
          this.options.logger.error(error);
        }
        return null;
      }
      throw error;
    }
  }
  private async getFromLocalFiles(
    fileName: string,
  ): Promise<ArrayBuffer | null> {
    const localPath = this.options.localDir;
    fs.mkdirSync(localPath, { recursive: true });
    const filePath = path.join(localPath, fileName);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const buffer = fs.readFileSync(filePath);
    return buffer.buffer;
  }
  private saveToLocalFiles(fileName: string, obj: ArrayBuffer): void {
    const localPath = this.options.localDir;
    fs.mkdirSync(localPath, { recursive: true });
    const filePath = path.join(localPath, fileName);
    fs.writeFileSync(filePath, Buffer.from(obj));
    this.options.logger.log(
      `${this.options.type} ${fileName} saved in local files`,
    );
  }
  private async saveToAws(fileName: string, obj: ArrayBuffer): Promise<void> {
    if (!this.options.activateAws) {
      return;
    }
    try {
      await this.s3Client!.send(
        new PutObjectCommand({
          Bucket: this.options.bucketName,
          Key: fileName,
          Body: Buffer.from(obj),
        }),
      );
      this.options.logger.log(`${this.options.type} ${fileName} saved in AWS`);
    } catch (error) {
      if (error instanceof S3ServiceException) {
        if (error.name === 'AccessDenied') {
          this.options.logger.error(
            `Access denied to bucket ${this.options.bucketName}`,
          );
        } else if (error.name === 'SignatureDoesNotMatch') {
          this.options.logger.error(
            `Invalid credentials to bucket ${this.options.bucketName}`,
          );
        } else if (error.name === 'NoSuchBucket') {
          this.options.logger.error(
            `Bucket ${this.options.bucketName} does not exist`,
          );
        } else {
          this.options.logger.error(error);
        }
      }
      throw error;
    }
  }
  private async deleteFromLocalFiles(fileName: string): Promise<void> {
    const localPath = this.options.localDir;
    fs.mkdirSync(localPath, { recursive: true });
    const filePath = path.join(localPath, fileName);
    if (!fs.existsSync(filePath)) {
      return;
    }
    fs.unlinkSync(filePath);
    this.options.logger.log(
      `${this.options.type} ${fileName} deleted from local files`,
    );
  }
  // private async deleteFromAws(fileName: string): Promise<void> {
  //   try {
  //     await this.s3Client!.send(
  //       new PutObjectCommand({
  //         Bucket: this.options.bucketName,
  //         Key: fileName,
  //       })
  //     );
  //     this.options.logger.log(
  //       `${this.options.type} ${fileName} deleted from AWS`
  //     );
  //   } catch (error) {
  //     if (error instanceof S3ServiceException) {
  //       if (error.name === 'AccessDenied') {
  //         this.options.logger.error(
  //           `Access denied to bucket ${this.options.bucketName}`
  //         );
  //       } else if (error.name === 'SignatureDoesNotMatch') {
  //         this.options.logger.error(
  //           `Invalid credentials to bucket ${this.options.bucketName}`
  //         );
  //       } else if (error.name === 'NoSuchBucket') {
  //         this.options.logger.error(
  //           `Bucket ${this.options.bucketName} does not exist`
  //         );
  //       } else {
  //         this.options.logger.error(error);
  //       }
  //     }
  //     throw error;
  //   }
  // }
  async save(fileName: string, obj: ArrayBuffer): Promise<T> {
    this.saveToLocalFiles(fileName, obj);
    await this.saveToAws(fileName, obj);
    const transformedObj = await this.options.transform(obj);
    return transformedObj;
  }
  async get(fileName: string): Promise<T | null> {
    let obj = await this.getFromLocalFiles(fileName);
    if (obj) {
      const transformedObj = await this.options.transform(obj);
      this.options.logger.log(
        `${this.options.type} ${fileName} loaded from local files`,
      );
      return transformedObj;
    }
    // If font is not found in local files, try to get it from AWS
    if (this.options.activateAws === false) {
      return null;
    }
    obj = await this.getFromAws(fileName);
    if (!obj) {
      return null;
    }
    const transformedObj = await this.options.transform(obj);
    this.options.logger.log(`${this.options.type} ${fileName} loaded from AWS`);
    // Save font in local files
    this.saveToLocalFiles(fileName, obj);
    return transformedObj;
  }
  async delete(fileName: string): Promise<void> {
    await this.deleteFromLocalFiles(fileName);
  }
}
