import { ValidateNested } from "class-validator";
import { UpdateContactDto } from "./update-contact.dto";
import { Lead } from "./update-lead.dto";

export class CreateLeadDto {
  @ValidateNested()
  lead: Lead;

  @ValidateNested()
  contact: UpdateContactDto[];
}
