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
exports.CreateLeadDto = void 0;
const class_validator_1 = require("class-validator");
const lead_model_dto_1 = require("./lead-model.dto");
const class_transformer_1 = require("class-transformer");
class CreateLeadDto {
}
__decorate([
    class_validator_1.ValidateNested(),
    class_transformer_1.Type(() => lead_model_dto_1.Lead),
    __metadata("design:type", lead_model_dto_1.Lead)
], CreateLeadDto.prototype, "lead", void 0);
__decorate([
    class_validator_1.ValidateNested(),
    __metadata("design:type", Array)
], CreateLeadDto.prototype, "contact", void 0);
exports.CreateLeadDto = CreateLeadDto;
//# sourceMappingURL=create-lead.dto.js.map