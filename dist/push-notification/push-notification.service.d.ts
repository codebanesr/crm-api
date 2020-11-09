/// <reference types="node" />
import { RequestOptions, PushSubscription, SendResult } from "web-push";
export declare class PushNotificationService {
    constructor();
    sendPushNotification(subscription: PushSubscription, payload?: string | Buffer | null | Record<string, any>, options?: RequestOptions): Promise<SendResult>;
}
