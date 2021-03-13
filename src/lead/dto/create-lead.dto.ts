import { ValidateNested } from "class-validator";
import { UpdateContactDto } from "./update-contact.dto";
import { Lead } from "./lead-model.dto";
import { Type } from "class-transformer";

export class CreateLeadDto {
  @ValidateNested()
  @Type(() => Lead)
  lead: Lead;

  @ValidateNested()
  contact: UpdateContactDto[];
}
