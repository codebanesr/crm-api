export declare class AttachmentDto {
    key: string;
    Location: string;
}
export declare class CreateEmailTemplateDto {
    content: string;
    subject: string;
    templateName: string;
    campaignId: string;
    attachments: AttachmentDto[];
}
export declare class BulkEmailDto {
    emails: string[];
    subject: string;
    text: string;
    attachments: AttachmentDto[];
}
