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
exports.GetGraphDataDto2 = exports.GetGraphDataDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class GetGraphDataDto {
}
__decorate([
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], GetGraphDataDto.prototype, "campaign", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Transform(v => new Date(v)),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], GetGraphDataDto.prototype, "endDate", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Transform(v => new Date(v)),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], GetGraphDataDto.prototype, "startDate", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsEmail({}, { each: true }),
    __metadata("design:type", Array)
], GetGraphDataDto.prototype, "handler", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", void 0)
], GetGraphDataDto.prototype, "prospectName", void 0);
exports.GetGraphDataDto = GetGraphDataDto;
class GetGraphDataDto2 {
}
__decorate([
    class_validator_1.IsMongoId({ each: true }),
    __metadata("design:type", Array)
], GetGraphDataDto2.prototype, "campaign", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Transform(v => new Date(v)),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], GetGraphDataDto2.prototype, "endDate", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Transform(v => new Date(v)),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], GetGraphDataDto2.prototype, "startDate", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsEmail({}, { each: true }),
    __metadata("design:type", Array)
], GetGraphDataDto2.prototype, "handler", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", void 0)
], GetGraphDataDto2.prototype, "prospectName", void 0);
exports.GetGraphDataDto2 = GetGraphDataDto2;
//# sourceMappingURL=get-graph-data.dto.js.map