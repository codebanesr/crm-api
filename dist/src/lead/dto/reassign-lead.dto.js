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
exports.ReassignLeadDto = exports.LeadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LeadDto {
}
exports.LeadDto = LeadDto;
class ReassignLeadDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: 'shanur@gcsns.com',
        description: 'Old users email',
        format: 'number',
        default: null
    }),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], ReassignLeadDto.prototype, "oldUserEmail", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 'shanur@gmail.com',
        description: 'Email of the new user',
        format: 'number',
        default: null
    }),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], ReassignLeadDto.prototype, "newUserEmail", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: { externalId: 1234 },
        description: 'Additional lead properties required to identify the lead',
        format: 'number',
        default: null
    }),
    class_validator_1.Allow(),
    __metadata("design:type", LeadDto)
], ReassignLeadDto.prototype, "lead", void 0);
exports.ReassignLeadDto = ReassignLeadDto;
//# sourceMappingURL=reassign-lead.dto.js.map