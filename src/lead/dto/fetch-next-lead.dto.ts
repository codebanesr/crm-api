import { MaxLength } from "class-validator";

export class FetchNextLeadDto {
  typeDict: Map<string, MapValue>;
  filters: Map<string, string>;
}

class MapValue {
  label: string;
  value: string;
  options: string[];
}
