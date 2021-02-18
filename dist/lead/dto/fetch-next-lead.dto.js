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
exports.FetchNextLeadDto = exports.TypeOfLead = void 0;
const class_validator_1 = require("class-validator");
var TypeOfLead;
(function (TypeOfLead) {
    TypeOfLead["fresh"] = "fresh";
    TypeOfLead["followUp"] = "followUp";
    TypeOfLead["freshAndFollowUp"] = "freshAndFollowUp";
})(TypeOfLead = exports.TypeOfLead || (exports.TypeOfLead = {}));
class NonKeyFilters {
}
__decorate([
    class_validator_1.IsEnum(TypeOfLead),
    __metadata("design:type", String)
], NonKeyFilters.prototype, "typeOfLead", void 0);
class FetchNextLeadDto {
}
__decorate([
    class_validator_1.ValidateNested(),
    __metadata("design:type", NonKeyFilters)
], FetchNextLeadDto.prototype, "nonKeyFilters", void 0);
exports.FetchNextLeadDto = FetchNextLeadDto;
class MapValue {
}
//# sourceMappingURL=fetch-next-lead.dto.js.map