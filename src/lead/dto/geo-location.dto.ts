import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class GeoLocationDto {
    @ApiProperty({
        example: '21.01',
        description: 'Latitude from coordinate',
        format: 'number',
        default: null
    })
    @IsNumber()
    readonly lat: number;


    @ApiProperty({
        example: '51',
        description: 'Longitude from coordinate',
        format: 'number',
        default: null
    })
    @IsNumber()
    readonly lng: number;
}