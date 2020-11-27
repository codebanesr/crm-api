export declare class UploadMultipleFilesDto {
    campaignName: string;
    files: S3UploadedFiles[];
}
export declare class S3UploadedFiles {
    Bucket: string;
    key: string;
    Location: string;
    Key: string;
}
