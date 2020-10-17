import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class FollowUpDto {
  @ApiProperty({
    example: "TODAY",
    description: `
            Takes date range (startDate, endDate)
        `,
    format: "number",
    default: 1,
  })
  @IsOptional()
  @IsString({ each: true })
  readonly interval?: string[];

  @IsString()
  readonly userEmail: string;

  @IsOptional()
  @IsString()
  campaignName?: string;
}

// @IsString()
// selectedCampaign: string = undefined;
