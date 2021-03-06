import { IsMongoId, IsEmail } from "class-validator";

export class BulkReassignDto {
    @IsMongoId({each: true})
    leadIds: string[]


    @IsEmail()
    userEmail: string;
}