/// <reference types="node" />
import { S3 } from "aws-sdk";
export declare class UploadService {
    s3Manager: S3;
    constructor();
    uploadFile(key: string, file: any): Promise<unknown>;
    uploadFileBuffer(key: string, fileBuffer: Buffer): Promise<any>;
    uploadFileStream({ filePath, contentType, key }: {
        filePath: any;
        contentType: any;
        key: any;
    }): Promise<S3.ManagedUpload.SendData>;
}
