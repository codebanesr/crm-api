export declare enum INTERVAL {
    "TODAY" = "TODAY",
    "THIS_WEEK" = "THIS_WEEK",
    "THIS_MONTH" = "THIS_MONTH"
}
export declare class FollowUpDto {
    readonly interval: INTERVAL;
    readonly userEmail: string;
}
