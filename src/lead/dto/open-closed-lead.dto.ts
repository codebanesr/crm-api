import { IsMongoId, IsString } from "class-validator";

export class OpenClosedLeadDto {
    @IsMongoId({each: true})
    leadIds: string[]
}