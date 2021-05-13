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
exports.CreateOrganizationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const organizational_enum_1 = require("../../utils/organizational.enum");
class CreateOrganizationDto {
    constructor() {
        this.type = organizational_enum_1.OrganizationalType.TRIAL;
        this.phoneNumberPrefix = "+91";
    }
}
__decorate([
    swagger_1.ApiProperty({
        example: 'Molecular',
        description: 'The name for your organization',
        type: String,
        uniqueItems: true,
        minLength: 6,
        maxLength: 255,
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.MinLength(6),
    class_validator_1.MaxLength(255),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 'shanur@gmail.com',
        description: 'Please enter your email id',
        type: String,
        uniqueItems: true,
        minLength: 6,
        maxLength: 255,
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    class_validator_1.MinLength(5),
    class_validator_1.MaxLength(255),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: organizational_enum_1.OrganizationalType.TRIAL,
        description: 'Type of subscription',
        type: String,
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsIn(Object.keys(organizational_enum_1.OrganizationalType)),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "+91",
        description: 'Country code',
        type: String,
    }),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MinLength(2),
    class_validator_1.MaxLength(4),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "phoneNumberPrefix", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "8122242312",
        description: 'Phone Number',
        type: String,
    }),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MinLength(8),
    class_validator_1.MaxLength(14),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "phoneNumber", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "Shanur Rahman",
        description: 'Full name of the account holder',
        type: String,
    }),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MinLength(4),
    class_validator_1.MaxLength(128),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "fullName", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "Password",
        description: 'Enter the password you want for your account',
        type: String,
    }),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MinLength(4),
    class_validator_1.MaxLength(14),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "https://s3.ap-south-1.amazonaws.com/molecule.static.files/_1607512889676anjeline.jpg",
        description: 'Enter the image for the organization for white labelling',
        type: String,
    }),
    class_validator_1.IsUrl(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "organizationImage", void 0);
__decorate([
    class_transformer_1.Type(() => Date),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], CreateOrganizationDto.prototype, "startDate", void 0);
__decorate([
    class_transformer_1.Type(() => Date),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], CreateOrganizationDto.prototype, "endDate", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], CreateOrganizationDto.prototype, "size", void 0);
exports.CreateOrganizationDto = CreateOrganizationDto;
//# sourceMappingURL=create-organization.dto.js.map