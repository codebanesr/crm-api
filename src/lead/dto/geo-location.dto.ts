import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class GeoLocationDto {
    @ApiProperty({
        example: '21.01',
        description: 'Latitude from coordinate',
        format: 'number',
        default: null
    })
    @Transform(v => +v)
    @IsNumber()
    readonly lat: number;


    @ApiProperty({
        example: '51',
        description: 'Longitude from coordinate',
        format: 'number',
        default: null
    })
    @Transform(v => +v)
    @IsNumber()
    readonly lng: number;
}