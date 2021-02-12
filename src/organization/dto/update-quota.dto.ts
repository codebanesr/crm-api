import { IsMongoId, IsNumber, IsPositive } from "class-validator"

export class UpdateQuotaDto {
    @IsNumber({maxDecimalPlaces: 0})
    @IsPositive()
    perUserRate: number;

    @IsNumber({maxDecimalPlaces: 0})
    @IsPositive()
    discount: number;

    @IsNumber({maxDecimalPlaces: 0})
    @IsPositive()
    seats: number;

    @IsNumber({maxDecimalPlaces: 0})
    @IsPositive()
    total: number;

    @IsNumber({maxDecimalPlaces: 0})
    @IsPositive()
    months: number;


    @IsMongoId()
    organization: string
}