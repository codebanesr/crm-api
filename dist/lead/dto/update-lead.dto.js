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
exports.UpdateLeadDto = exports.Lead = exports.ReassignmentInfo = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class GeoLocation {
}
__decorate([
    class_validator_1.IsNumber({}, { each: true }),
    __metadata("design:type", Array)
], GeoLocation.prototype, "coordinates", void 0);
class ReassignmentInfo {
}
exports.ReassignmentInfo = ReassignmentInfo;
class Lead {
}
__decorate([
    swagger_1.ApiProperty({
        example: "1",
        description: "The id coming from external system",
        format: "string",
        default: "ABCDE",
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], Lead.prototype, "externalId", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "shanur@gmail.com",
        description: "email of user that is creating the lead",
        type: String,
        required: false,
        default: null,
    }),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], Lead.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "Campaign-spec-v1",
        description: "Campaign to which this lead belongs",
        type: String,
        default: "core",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "campaign", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "john",
        description: "Customer's first name to which this lead is associated with",
        type: String,
        default: "john",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "firstName", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "doe",
        description: "Customer's last name to which this lead is associated with",
        type: String,
        default: "doe",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "lastName", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "1",
        description: "Source of lead",
        type: String,
        default: 1,
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "source", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0),
    swagger_1.ApiProperty({
        example: 1000,
        description: "Lead amount",
        type: Number,
        default: 0,
    }),
    class_transformer_1.Type(() => Number),
    __metadata("design:type", Number)
], Lead.prototype, "amount", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "shanur@gcsns.com",
        description: "Customer's email ",
        type: String,
        default: "s@g.com",
    }),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], Lead.prototype, "customerEmail", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "+91",
        description: "Phone number prefix",
        format: "number",
        default: 1,
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "phoneNumberPrefix", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "9199945454",
        description: "Mobile Number",
        type: String,
        default: "-",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "phoneNumber", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "Nurturing",
        description: "Describes the status of the lead",
        type: String,
        default: "CLOSED",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "leadStatus", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "Park view CA",
        description: "Address of the customer",
        type: String,
        default: "",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "address", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: new Date(),
        description: "Page Number in paginated view",
        format: "number",
        default: new Date(),
    }),
    class_validator_1.IsDateString(),
    __metadata("design:type", Date)
], Lead.prototype, "followUp", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "moleculesns",
        description: "Name of company from which lead is coming",
        type: String,
        default: "unspecified",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "companyName", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "Very nice product",
        description: "Latest remark after disposition",
        type: String,
        default: "No remarks",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "remarks", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "CRM",
        description: "Describe the product",
        type: String,
        default: "",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "product", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "coordinates",
        required: false,
        description: "User's geo location",
        type: JSON,
        default: 1,
    }),
    class_validator_1.ValidateNested(),
    __metadata("design:type", GeoLocation)
], Lead.prototype, "geoLocation", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "1",
        description: "Which bucket this product falls into",
        type: String,
        default: "Buck0",
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], Lead.prototype, "bucket", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "New Patliputra",
        description: "Describe the operational area of the customer/company",
        type: String,
        default: "NPC",
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], Lead.prototype, "operationalArea", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 808901,
        description: "Area Pincode",
        type: Number,
        default: "-",
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], Lead.prototype, "pincode", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Lead.prototype, "nextAction", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], Lead.prototype, "documentLinks", void 0);
exports.Lead = Lead;
class UpdateLeadDto {
}
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", ReassignmentInfo)
], UpdateLeadDto.prototype, "reassignmentInfo", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], UpdateLeadDto.prototype, "emailForm", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], UpdateLeadDto.prototype, "campaignId", void 0);
exports.UpdateLeadDto = UpdateLeadDto;
//# sourceMappingURL=update-lead.dto.js.map