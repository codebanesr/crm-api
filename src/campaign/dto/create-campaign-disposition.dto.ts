import { IsJSON, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCampaignAndDispositionDto {
    @ApiProperty({
        description: "Contains the disposition tree for the given campaign",
        example: "This will be a stringified json tree structure, check db schema for more details"
    })
    @IsString()
    dispositionData: string


    @ApiProperty({
        description: "Contains information about the campaign",
        example: "Check the database schema for more details"
    })
    @IsString()
    campaignInfo: string
}