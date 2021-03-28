import { EActions, Trigger } from "../rules.constants";
export declare class RuleDto {
    campaign: string;
    action: EActions;
    changeHandler: string;
    daysOverdue: number;
    disposition: string;
    fromDisposition: string;
    newDisposition: string;
    newHandler: string;
    numberOfAttempts: number;
    toDisposition: string;
    trigger: Trigger;
    url: string;
}
