export declare class AttachmentDto {
    key: string;
    Location: string;
}
export declare class CreateEmailTemplateDto {
    content: string;
    subject: string;
    campaign: string;
    attachments: AttachmentDto[];
}
export declare class BulkEmailDto {
    emails: string[];
    subject: string;
    text: string;
    attachments: AttachmentDto[];
}
