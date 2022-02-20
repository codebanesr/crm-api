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
exports.GetTransactionDto = exports.SortOrder = void 0;
const class_validator_1 = require("class-validator");
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
class GetTransactionDto {
    constructor() {
        this.page = 1;
        this.perPage = 20;
    }
}
__decorate([
    class_transformer_1.Transform(val => +val),
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], GetTransactionDto.prototype, "page", void 0);
__decorate([
    class_transformer_1.Transform(val => +val),
    __metadata("design:type", Number)
], GetTransactionDto.prototype, "perPage", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], GetTransactionDto.prototype, "sortBy", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsEnum(SortOrder),
    __metadata("design:type", String)
], GetTransactionDto.prototype, "sortOrder", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Transform(val => new Date(val)),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], GetTransactionDto.prototype, "startDate", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Transform(val => new Date(val)),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], GetTransactionDto.prototype, "endDate", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], GetTransactionDto.prototype, "handler", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_transformer_1.Transform(val => {
        if (val === "null") {
            return null;
        }
        return val;
    }),
    __metadata("design:type", String)
], GetTransactionDto.prototype, "prospectName", void 0);
__decorate([
    class_transformer_1.Transform(val => {
        if (val === "null") {
            return null;
        }
        return val;
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], GetTransactionDto.prototype, "campaign", void 0);
__decorate([
    class_transformer_1.Transform(value => {
        return value == "undefined" ? null : value;
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], GetTransactionDto.prototype, "leadId", void 0);
__decorate([
    class_transformer_1.Transform(value => {
        if (value == "true" || value == true) {
            return true;
        }
        return false;
    }),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], GetTransactionDto.prototype, "isStreamable", void 0);
exports.GetTransactionDto = GetTransactionDto;
//# sourceMappingURL=get-transaction.dto.js.map