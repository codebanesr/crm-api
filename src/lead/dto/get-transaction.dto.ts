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
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString({each: true})
  handler: string[];

  @IsString()
  prospectName: string;

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
  filters?: TransactionFilter;
}

