"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkEmailDto = exports.CreateEmailTemplateDto = exports.AttachmentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class AttachmentDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: "This is the filename",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AttachmentDto.prototype, "key", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "This is the location inside aws where the file is stored",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AttachmentDto.prototype, "Location", void 0);
exports.AttachmentDto = AttachmentDto;
class CreateEmailTemplateDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: "some content which goes into the body of the email",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailTemplateDto.prototype, "content", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "This is a sample subject",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailTemplateDto.prototype, "subject", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "This will become the subject of the email template",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailTemplateDto.prototype, "templateName", void 0);
__decorate([
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], CreateEmailTemplateDto.prototype, "campaignId", void 0);
__decorate([
    swagger_1.ApiProperty({
        examples: [
            {
                filename: "somefilename",
                path: "somefilepath",
            },
            {
                filename: "somefilename",
                path: "somefilepath",
            },
        ],
    }),
    class_validator_1.IsArray(),
    class_transformer_1.Type(() => AttachmentDto),
    class_validator_1.ValidateNested(),
    __metadata("design:type", Array)
], CreateEmailTemplateDto.prototype, "attachments", void 0);
exports.CreateEmailTemplateDto = CreateEmailTemplateDto;
class BulkEmailDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: "",
    }),
    class_validator_1.IsArray(),
    class_transformer_1.Type(() => String),
    __metadata("design:type", Array)
], BulkEmailDto.prototype, "emails", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "This will become the subject of the email template",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], BulkEmailDto.prototype, "subject", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "Email content, body of email",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], BulkEmailDto.prototype, "text", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: {
            filename: "somefilename",
            path: "somefilepath",
        },
    }),
    class_validator_1.IsArray(),
    class_transformer_1.Type(() => AttachmentDto),
    class_validator_1.ValidateNested(),
    __metadata("design:type", Array)
], BulkEmailDto.prototype, "attachments", void 0);
exports.BulkEmailDto = BulkEmailDto;
//# sourceMappingURL=create-email-template.dto.js.map