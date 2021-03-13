import { IsMongoId } from "class-validator";

export class BulkUnArchiveLeads {
    @IsMongoId({each: true})
    leadIds: string[];
}