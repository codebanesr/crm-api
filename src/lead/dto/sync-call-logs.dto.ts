import { IsDateString, IsNumber, IsString, IsUrl, IsArray, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SyncCallLogsDto {
    @ApiProperty({
        example: 'shanur@gcsns.com',
        description: 'Old users email',
        format: 'number',
        default: null
    })
    @IsDateString()
    date :string;


    @ApiProperty({
        example: '9199946568',
        description: 'Phone number from call logs',
        type: String,
        default: null
    })
    @IsString()
    number: String

    @ApiProperty({
        example: 33333
    })
    @IsNumber()
    type: Number

    @ApiProperty({
        example: 33333
    })
    @IsNumber()
    duration: Number


    @ApiProperty({
        example: 33333
    })
    @IsNumber()
    new : Number

    @ApiProperty({
        example: 33333
    })
    @IsNumber()
    cachedNumberType : Number;

    @ApiProperty({
        example: "account identifier"
    })
    @IsString()
    "phoneAccountId" : String;

    @ApiProperty({
        example: 33333
    })
    @IsString()
    "viaNumber" : String


    @ApiProperty({
        example: "shanur rahman"
    })
    @IsString()
    "name" : String

    @ApiProperty({
        example: "shubham nitap"
    })
    @IsString()
    "contact" : String

    @ApiProperty({
        example: "this will be replaced by IsUrl"
    })
    @IsString()
    "photo" : String


    @IsString()
    "thumbPhoto" : String
}
