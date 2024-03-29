// const {
//     page,
//     perPage,
//     sortBy = "createdAt",
//     showCols,
//     searchTerm,
//     filters,
//   } = body;

import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsArray,
  IsJSON,
  IsBoolean,
  IsDateString,
  IsEmail,
  ValidateNested,
  IsMongoId,
  IsPositive,
  IsNotEmpty,
  IsIn,
  IsEnum,
} from "class-validator";
import { AssignmentEnum } from "../enum/generic.enum";

export class FiltersDto {
  @IsBoolean()
  showArchived?: boolean;

  @IsBoolean()
  showClosed?: boolean;

  @IsEnum(AssignmentEnum)
  assigned: AssignmentEnum;

  @IsArray()
  dateRange: string[] = [];

  @IsMongoId()
  selectedCampaign: string = undefined;

  @IsString({each: true})
  leadStatusKeys: string[];


  @IsEmail({}, {each: true})
  handlers: string[];
}

export class FindAllDto {
  @ApiProperty({
    example: "1",
    description: "Page Number in paginated view",
    format: "number",
    default: 1,
  })
  @IsNumber()
  readonly page: number = 1;

  @ApiProperty({
    example: "15",
    description: "Number of records you want in selected page",
    format: "number",
    default: 15,
  })
  @IsPositive()
  readonly perPage: number = 20;

  @ApiProperty({
    example: "15",
    description: "The property you want to sort by",
    format: "string",
  })
  @IsString()
  readonly sortBy: string = "createdAt";

  @ApiProperty({
    example: ["email", "leadStatus", "name"],
    description: "Cols to show in lead view",
    format: "string",
    default: "createdAt",
  })
  @IsArray()
  readonly showCols: string[] = [];

  @ApiProperty({
    example: "sha",
  })
  @IsString()
  readonly searchTerm: string = "";

  @ApiProperty({
    example: {
      archived: false,
      assigned: true,
      dateRange: null,
      handlerEmail: "seniormanager@gmail.com",
      moduleTypes: null,
    },
  })
  readonly filters?: FiltersDto;

  readonly typeDict?: any;

  // @IsString()
  campaignId: string;
}
