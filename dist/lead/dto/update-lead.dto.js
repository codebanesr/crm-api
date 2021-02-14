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
exports.UpdateLeadDto = exports.UpdateLead = exports.ReassignmentInfo = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const call_status_enum_1 = require("../enum/call-status.enum");
const lead_model_dto_1 = require("./lead-model.dto");
class GeoLocation {
}
__decorate([
    class_validator_1.IsNumber({}, { each: true }),
    __metadata("design:type", Array)
], GeoLocation.prototype, "coordinates", void 0);
class ReassignmentInfo {
}
exports.ReassignmentInfo = ReassignmentInfo;
class CallRecord {
}
__decorate([
    class_transformer_1.Type(() => Number),
    __metadata("design:type", Number)
], CallRecord.prototype, "type", void 0);
__decorate([
    class_validator_1.IsEnum(call_status_enum_1.ECallStatus),
    __metadata("design:type", String)
], CallRecord.prototype, "callStatus", void 0);
class UpdateLead extends lead_model_dto_1.Lead {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateLead.prototype, "leadStatus", void 0);
exports.UpdateLead = UpdateLead;
class UpdateLeadDto {
}
__decorate([
    class_validator_1.ValidateNested(),
    class_transformer_1.Type(() => UpdateLead),
    __metadata("design:type", UpdateLead)
], UpdateLeadDto.prototype, "lead", void 0);
__decorate([
    class_validator_1.ValidateNested(),
    __metadata("design:type", GeoLocation)
], UpdateLeadDto.prototype, "geoLocation", void 0);
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
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.ValidateNested(),
    __metadata("design:type", CallRecord)
], UpdateLeadDto.prototype, "callRecord", void 0);
exports.UpdateLeadDto = UpdateLeadDto;
//# sourceMappingURL=update-lead.dto.js.map