import { UpdateContactDto } from "./update-contact.dto";
import { Lead } from "./lead-model.dto";
export declare class CreateLeadDto {
    lead: Lead;
    contact: UpdateContactDto[];
}
