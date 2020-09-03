// const {
//     page,
//     perPage,
//     sortBy = "createdAt",
//     showCols,
//     searchTerm,
//     filters,
//   } = body;

import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsArray, IsJSON } from "class-validator";

export class FindAllDto {
    @ApiProperty({
        example: '1',
        description: 'Page Number in paginated view',
        format: 'number',
        default: 1
    })
    @IsNumber()
    readonly page: number;
      

    @ApiProperty({
        example: '15',
        description: 'Number of records you want in selected page',
        format: 'number',
        default: 15
    })
    @IsNumber()
    readonly perPage: number;


    @ApiProperty({
        example: '15',
        description: 'The property you want to sort by',
        format: 'string',
        default: 'createdAt'
    })
    @IsString()
    readonly sortBy: string;

    @ApiProperty({
        example: ['email', 'leadStatus', 'name'],
        description: 'Cols to show in lead view',
        format: 'string',
        default: 'createdAt'
    })
    @IsArray()
    readonly showCols: string[];


    @ApiProperty({
        example: 'sha'
    })
    @IsString()
    readonly searchTerm: string;


    @ApiProperty({
        example: {}
    })
    @IsJSON()
    readonly filters: JSON;
}