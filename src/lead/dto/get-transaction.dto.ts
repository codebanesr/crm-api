import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import "reflect-metadata"
import { Transform, Type } from "class-transformer";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

class Pagination {
  @IsPositive()
  page: number = 1;

  @IsPositive()
  perPage: number = 20;

  @IsString()
  sortBy: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}

class TransactionFilter {
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

  @IsOptional()
  @IsMongoId()
  leadId: string;
}

export class GetTransactionDto {
  @IsNotEmpty()
  @ValidateNested({ message: "this is a required field" })
  pagination: Pagination;

  @IsOptional()
  @ValidateNested()
  @Type(()=> TransactionFilter)
  filters?: TransactionFilter;
}

