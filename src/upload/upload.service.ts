import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ContentType } from "aws-sdk/clients/devicefarm";
import { createReadStream } from "fs";
import { PassThrough, Stream } from "stream";
import AppConfig from "../config/config";

@Injectable()
export class UploadService {
  s3Manager = new S3({
    accessKeyId: AppConfig.s3.accessKeyId,
    secretAccessKey: AppConfig.s3.secretAccessKey,
    region: AppConfig.s3.region,
  });

  constructor() {}

  async uploadFile(key: string, file: any) {
    const params = {
      Bucket: "molecule.uploads",
      Key: key + file.name,
      Body: file,
    };

    return new Promise((resolve, reject) => {
      this.s3Manager.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }

  async uploadFileBuffer(key: string, fileBuffer: Buffer): Promise<any> {
    const params = {
      Bucket: "applesaucecrm",
      Key: key,
      Body: fileBuffer,
    };

    return this.s3Manager.upload(params).promise();
  }

  public async uploadFileStream({filePath, contentType, key}): Promise<S3.ManagedUpload.SendData> { 
    return this.s3Manager.upload({
      Bucket : "applesaucecrm",
      Key : key,
      ContentType : contentType,
      Body : createReadStream(filePath)
    }).promise();
  }
}
