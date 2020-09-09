// const {
//     page,
//     perPage,
//     sortBy = "createdAt",
//     showCols,
//     searchTerm,
//     filters,
//   } = body;

import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsArray, IsJSON, IsBoolean, IsDateString, IsEmail, ValidateNested } from "class-validator";



export class FiltersDto {
    @IsBoolean()
    archived: false;

    @IsBoolean()
    assigned: true;

    @IsArray()
    dateRange: string[] = [];

    @IsString()
    selectedCampaign: string = undefined;

}


export class FindAllDto {
    @ApiProperty({
        example: '1',
        description: 'Page Number in paginated view',
        format: 'number',
        default: 1
    })
    @IsNumber()
    readonly page: number = 1;
      

    @ApiProperty({
        example: '15',
        description: 'Number of records you want in selected page',
        format: 'number',
        default: 15
    })
    @IsNumber()
    readonly perPage: number=20;


    @ApiProperty({
        example: '15',
        description: 'The property you want to sort by',
        format: 'string',
    })
    @IsString()
    readonly sortBy: string = 'createdAt';

    @ApiProperty({
        example: ['email', 'leadStatus', 'name'],
        description: 'Cols to show in lead view',
        format: 'string',
        default: 'createdAt'
    })
    @IsArray()
    readonly showCols: string[] = [];


    @ApiProperty({
        example: 'sha'
    })
    @IsString()
    readonly searchTerm: string = '';


    @ApiProperty({
        example: {
            archived: false,
            assigned: true,
            dateRange: null,
            handlerEmail: "seniormanager@gmail.com",
            moduleTypes: null,
        }
    })
    readonly filters?: FiltersDto
}
