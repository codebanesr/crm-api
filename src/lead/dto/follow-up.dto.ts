import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";


export enum INTERVAL {
    "TODAY" = "TODAY",
    "THIS_WEEK" = "THIS_WEEK",
    "THIS_MONTH" = "THIS_MONTH",
}


export class FollowUpDto {
    @ApiProperty({
        example: 'TODAY',
        description: `
            Add duration "TODAY", "THIS_WEEK", "THIS_MONTH", returns upcoming leads during
            that duration. Takes current date as the reference point
        `,
        format: 'number',
        default: 1
    })
    @IsEnum(INTERVAL)
    readonly interval: INTERVAL

    @IsString()
    readonly userEmail: string
}



// @IsString()
// selectedCampaign: string = undefined;