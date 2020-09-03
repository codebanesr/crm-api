import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UploadMultipleFilesDto {
    @ApiProperty({
        example: "campaignName",
        description: "If upload fails then change the backend code from files[] to files"
    })
    @IsString()
    campaignName: string;
}