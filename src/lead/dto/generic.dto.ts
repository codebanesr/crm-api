import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class UploadMultipleFilesDto {
  @ApiProperty({
    example: "campaignName",
    description:
      "If upload fails then change the backend code from files[] to files",
  })
  @IsString()
  campaignName: string;


  @IsNotEmpty()
  @IsMongoId()
  campaignId: string;

  files: S3UploadedFiles[];
}

export class S3UploadedFiles {
  Bucket: string;
  key: string;
  Location: string;
  Key: string;
}
