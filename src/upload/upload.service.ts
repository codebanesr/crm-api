import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import AppConfig from "../config/config";

@Injectable()
export class UploadService {
  bucket = new S3({
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
      this.bucket.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }

  async uploadFileBuffer(key: string, fileBuffer: Buffer): Promise<any> {
    const params = {
      Bucket: "molecule.static.files",
      Key: key,
      Body: fileBuffer,
    };

    return this.bucket.upload(params).promise();
  }
}
