import { Type } from "class-transformer";
import { IsDate, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class GetUsersLocationsDto {
    @IsNotEmpty()
    @IsMongoId({each: true})
    userIds: string[]
    
    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    endDate: Date;

    @IsMongoId()
    campaign: string;
}