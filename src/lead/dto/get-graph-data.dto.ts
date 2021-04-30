import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import * as moment from "moment";

export class GetGraphDataDto {
    // private startDate = moment().startOf('month').subtract(2,'month').toDate();
    // private endDate = moment().endOf('month').toDate();
  
    @IsMongoId()
    campaign: string;

    @IsOptional()
    @Transform(v => new Date(v))
    @IsDate()
    endDate?: Date;


    @IsOptional()
    @Transform(v => new Date(v))
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsEmail({}, {each: true})
    handler?: string[];

    @IsOptional()
    @IsString()
    prospectName: null;
}


export class GetGraphDataDto2 {
    @IsMongoId({each: true})
    campaign: string[];

    @IsOptional()
    @Transform(v => new Date(v))
    @IsDate()
    endDate?: Date;


    @IsOptional()
    @Transform(v => new Date(v))
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsEmail({}, {each: true})
    handler?: string[];

    @IsOptional()
    @IsString()
    prospectName: null;
}