import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetGraphDataDto {
    @IsOptional()
    @IsMongoId()
    campaign?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsEmail({}, {each: true})
    handler?: string[];

    @IsOptional()
    @IsString()
    prospectName: null;

    @IsOptional()
    @IsDateString()
    @IsDate()
    startDate?: string;
}