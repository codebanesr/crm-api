import { IsNumber, IsJSON, IsString, Allow, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindCampaignsDto {
    @ApiProperty({
        type: Number,
        description: "Current page you are looking at",
        default: 1
    })
    @IsNumber()
    page: number = 1

    @ApiProperty({
        type: Number,
        description: "Number of records per page required",
        default: 20
    })
    @IsNumber()
    perPage: number = 20

    @ApiProperty({
        required: false,
        type: JSON,
        description: "List of filters to be applied, docs will be added on request"
    })
    @Allow()
    filters = {}

    @ApiProperty({
        type: String,
        required: false,
        description: "The campaign property to sort campaigns "
    })
    @IsString()
    sortBy: string = "handler";

    @IsOptional()
    @IsString({each: true})
    select?: string[];
}