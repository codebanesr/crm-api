import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class GetUsersLocationsDto {
    @IsNotEmpty()
    @IsMongoId({each: true})
    userIds: string[]
}