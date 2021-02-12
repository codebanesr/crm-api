export declare enum Trigger {
    dispositionChange = "dispositionChange",
    numberOfAttempts = "numberOfAttempts",
    overdueFollowups = "overdueFollowups",
    repeatedDisposition = "repeatedDisposition",
    changeHandler = "changeHandler"
}
export declare const TriggerOptions: {
    label: string;
    value: Trigger;
}[];
export declare enum EActions {
    changeDisposition = "changeDisposition",
    callApi = "callApi",
    changeProspectHandler = "changeProspectHandler"
}
export declare const ActionOptions: {
    label: string;
    value: EActions;
}[];
