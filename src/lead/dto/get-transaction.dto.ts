import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

class Pagination {
  @IsNumber()
  page: number = 1;

  @IsNumber()
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
}

export class GetTransactionDto {
  @IsNotEmpty()
  @ValidateNested({ message: "this is a required field" })
  pagination: Pagination;

  @IsOptional()
  @ValidateNested()
  filters?: TransactionFilter;
}

