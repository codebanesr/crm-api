// content, subject, campaign, attachments

import {
  IsArray,
  ValidateNested,
  IsString,
  IsEmail,
  IsMongoId,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class AttachmentDto {
  @ApiProperty({
    example: "This is the filename",
  })
  @IsString()
  key: string;

  @ApiProperty({
    example: "This is the location inside aws where the file is stored",
  })
  @IsString()
  Location: string;
}

export class CreateEmailTemplateDto {
  @ApiProperty({
    example: "some content which goes into the body of the email",
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: "This is a sample subject",
  })
  @IsString()
  subject: string;

  @ApiProperty({
    example: "This will become the subject of the email template",
  })
  @IsString()
  templateName: string;

  @IsMongoId()
  campaignId: string;

  @ApiProperty({
    example: [
      {
        filename: "somefilename",
        path: "somefilepath",
      },
      {
        filename: "somefilename",
        path: "somefilepath",
      },
    ],
  })
  @IsArray()
  @Type(() => AttachmentDto)
  @ValidateNested()
  attachments: AttachmentDto[];
}

export class BulkEmailDto {
  @ApiProperty({
    example: "",
  })
  @IsArray()
  @Type(() => String)
  emails: string[];

  @ApiProperty({
    example: "This will become the subject of the email template",
  })
  @IsString()
  subject: string;

  @ApiProperty({
    example: "Email content, body of email",
  })
  @IsString()
  text: string;

  @ApiProperty({
    example: {
      filename: "somefilename",
      path: "somefilepath",
    },
  })
  @IsArray()
  @Type(() => AttachmentDto)
  @ValidateNested()
  attachments: AttachmentDto[];
}
