import { UpdateContactDto } from "./update-contact.dto";
import { Lead } from "./update-lead.dto";

export class CreateLeadDto {
  lead: Lead;
  contact: UpdateContactDto[];
}
