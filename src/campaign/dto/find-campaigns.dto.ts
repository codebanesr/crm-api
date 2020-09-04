import { IsNumber, IsJSON, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindCampaignsDto {
    @ApiProperty({
        type: Number,
        description: "Current page you are looking at",
        required: false,
        default: 1
    })
    @IsNumber()
    page: number

    @ApiProperty({
        type: Number,
        description: "Number of records per page required",
        required: false,
        default: 20
    })
    @IsNumber()
    perPage: number

    @ApiProperty({
        required: false,
        type: JSON,
        default: {},
        description: "List of filters to be applied, docs will be added on request"
    })
    @IsJSON()
    filters: JSON

    @ApiProperty({
        type: String,
        required: false,
        default: "handler",
        description: "The campaign property to sort campaigns "
    })
    @IsString()
    sortBy: string
}