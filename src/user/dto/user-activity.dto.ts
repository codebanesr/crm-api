import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsOptional } from "class-validator";

export class UserActivityDto {
    @IsOptional()
    @IsDateString({each: true})
    @Type(() => Date)
    dateRange?: Date[]

    @IsEmail()
    userEmail: string
}