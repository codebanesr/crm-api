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
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
class Pagination {
    constructor() {
        this.page = 1;
        this.perPage = 20;
    }
}
__decorate([
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], Pagination.prototype, "page", void 0);
__decorate([
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], Pagination.prototype, "perPage", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Pagination.prototype, "sortBy", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsEnum(SortOrder),
    __metadata("design:type", String)
], Pagination.prototype, "sortOrder", void 0);
class TransactionFilter {
}
__decorate([
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], TransactionFilter.prototype, "startDate", void 0);
__decorate([
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], TransactionFilter.prototype, "endDate", void 0);
__decorate([
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], TransactionFilter.prototype, "handler", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], TransactionFilter.prototype, "prospectName", void 0);
__decorate([
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], TransactionFilter.prototype, "campaign", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], TransactionFilter.prototype, "leadId", void 0);
class GetTransactionDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.ValidateNested({ message: "this is a required field" }),
    __metadata("design:type", Pagination)
], GetTransactionDto.prototype, "pagination", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.ValidateNested(),
    __metadata("design:type", TransactionFilter)
], GetTransactionDto.prototype, "filters", void 0);
exports.GetTransactionDto = GetTransactionDto;
//# sourceMappingURL=get-transaction.dto.js.map