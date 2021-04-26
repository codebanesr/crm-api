import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class DcaeDto {
    @IsNotEmpty()
    @IsMongoId()
    campaignId: string;


    @IsString()
    superAdminKey: string;
}