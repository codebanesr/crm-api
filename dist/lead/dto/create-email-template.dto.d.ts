export declare class AttachmentDto {
    filename: string;
    path: string;
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
