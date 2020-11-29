import {
  IsEnum,
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

export class GetTransactionDto {
  @IsNotEmpty()
  @ValidateNested({ message: "this is a required field" })
  pagination: Pagination;

  filters: any;
}
