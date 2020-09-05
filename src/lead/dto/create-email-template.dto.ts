// content, subject, campaign, attachments

import { IsArray, ValidateNested, IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';

export class AttachmentDto {
    @ApiProperty({
        example: "somefilename"
    })
    @IsString()
    filename: string;

    @ApiProperty({
        example: "somefilepath"
    })
    @IsString()
    path: string;
}

export class CreateEmailTemplateDto {
    @ApiProperty({
        example: "some content which goes into the body of the email"
    })
    @IsString()
    content: string;

    @ApiProperty({
        example: "This is a sample subject"
    })
    @IsString()
    subject: string;

    @ApiProperty({
        example: "This will become the subject of the email template"
    })
    @IsString()
    campaign: string;

    @ApiProperty({
        examples: [{
            filename: "somefilename",
            path: "somefilepath"
        }, {
            filename: "somefilename",
            path: "somefilepath"
        }]
    })
    @IsArray()
    @Type(() => AttachmentDto)
    @ValidateNested()
    attachments: AttachmentDto[]
}


export class BulkEmailDto {
    @ApiProperty({
        example: ""
    })
    @IsArray()
    @Type(() => String)
    emails: string[]

    @ApiProperty({
        example: "This will become the subject of the email template"
    })
    @IsString()
    subject: string


    @ApiProperty({
        example: "Email content, body of email"
    })
    @IsString()
    text: string


    @ApiProperty({
        example: {
            filename: "somefilename",
            path: "somefilepath"            
        }
    })
    @IsArray()
    @Type(() => AttachmentDto)
    @ValidateNested()
    attachments: AttachmentDto[]
}