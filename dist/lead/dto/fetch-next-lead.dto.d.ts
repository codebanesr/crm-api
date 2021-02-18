export declare enum TypeOfLead {
    fresh = "fresh",
    followUp = "followUp",
    freshAndFollowUp = "freshAndFollowUp"
}
declare class NonKeyFilters {
    typeOfLead: TypeOfLead;
}
export declare class FetchNextLeadDto {
    typeDict: Map<string, MapValue>;
    filters?: Map<string, string>;
    nonKeyFilters?: NonKeyFilters;
}
declare class MapValue {
    label: string;
    value: string;
    options: string[];
}
export {};
