import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Transform } from "class-transformer";

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

  @IsOptional()
  @IsString()
  readonly userEmail?: string;

  @IsOptional()
  @IsString()
  @Transform(v=>{
    if(v === 'all') {
      return null
    }

    return v;
  })
  campaignId?: string;

  @IsNumber()
  readonly page: number;

  @IsNumber()
  readonly perPage: number;
}

// @IsString()
// selectedCampaign: string = undefined;
