import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import "reflect-metadata"
import { Transform, Type } from "class-transformer";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export class GetTransactionDto {
  @Transform(val=> +val)
  @IsPositive()
  page: number = 1;

  @Transform(val=> +val)
  perPage: number = 20;

  @IsString()
  sortBy: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @IsOptional()
  @Transform(val=> new Date(val))
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Transform(val=> new Date(val))
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsString({each: true})
  handler: string[];

  @IsOptional()
  @IsString()
  @Transform(val=>{
    if(val === "null") {
      return null;
    }

    return val;
  })
  prospectName: string;

  @Transform(val=>{
    if(val === "null") {
      return null;
    }

    return val;
  })
  @IsOptional()
  @IsMongoId()
  campaign: string;

  @Transform(value=>{
    return value == "undefined" ? null: value
      
  })
  @IsOptional()
  @IsMongoId()
  leadId: string;


  @Transform(value=>{
    if(value == "true" || value == true) {
      return true;
    }

    return false;
  })
  @IsBoolean()
  isStreamable: boolean;
}

