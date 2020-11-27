/// <reference types="node" />
import { S3 } from "aws-sdk";
export declare class UploadService {
    bucket: S3;
    constructor();
    uploadFile(key: string, file: any): Promise<unknown>;
    uploadFileBuffer(key: string, fileBuffer: Buffer): Promise<any>;
}
