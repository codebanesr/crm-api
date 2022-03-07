import { SendMailOptions } from "nodemailer";
import { SNSClient } from "@aws-sdk/client-sns";
export declare class NotificationService {
    transporter: import("nodemailer/lib/mailer");
    snsClient: SNSClient;
    sendMail(options: SendMailOptions): Promise<unknown>;
    sendSms(): Promise<void | import("@aws-sdk/client-sns").AddPermissionCommandOutput>;
}
