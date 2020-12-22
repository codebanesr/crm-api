import { IsNumber, ValidateNested } from "class-validator";

class Coordinate {
    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;
}

export class AddLocationDto {
    @ValidateNested()
    coordinate: Coordinate
}