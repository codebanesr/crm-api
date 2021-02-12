import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetGraphDataDto {
    @IsMongoId()
    @IsOptional()
    campaign: string;

    @Transform((o)=>new Date(o))
    @IsDate()
    endDate: Date;

    @IsNotEmpty()
    @IsEmail({}, {each: true})
    handler: [];

    @IsOptional()
    @IsString()
    prospectName: null;

    @Transform((o)=>new Date(o))
    @IsDate()
    startDate: Date;
}