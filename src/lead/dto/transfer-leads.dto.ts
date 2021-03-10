import { IsMongoId } from "class-validator";

export class TransferLeadsDto {
    @IsMongoId()
    toCampaignId: string;


    @IsMongoId({each: true})
    leadIds: string[];
}