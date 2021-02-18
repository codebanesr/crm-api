import { IsEnum, MaxLength, ValidateNested } from "class-validator";

export enum TypeOfLead {
  fresh = 'fresh',
  followUp = 'followUp',
  freshAndFollowUp = 'freshAndFollowUp'
}
class NonKeyFilters {
  @IsEnum(TypeOfLead)
  typeOfLead: TypeOfLead;
}
export class FetchNextLeadDto {
  typeDict: Map<string, MapValue>;
  filters?: Map<string, string>;
  
  @ValidateNested()
  nonKeyFilters?: NonKeyFilters;
}

class MapValue {
  label: string;
  value: string;
  options: string[];
}
