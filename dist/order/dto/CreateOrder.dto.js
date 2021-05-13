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
exports.CreateOrderDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class OrderMeta {
}
__decorate([
    class_transformer_1.Transform((v) => +v),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], OrderMeta.prototype, "perUserRate", void 0);
__decorate([
    class_transformer_1.Transform((v) => +v),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], OrderMeta.prototype, "discount", void 0);
__decorate([
    class_transformer_1.Transform((v) => +v),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], OrderMeta.prototype, "seats", void 0);
__decorate([
    class_transformer_1.Transform((v) => +v),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], OrderMeta.prototype, "total", void 0);
__decorate([
    class_transformer_1.Transform((v) => +v),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], OrderMeta.prototype, "months", void 0);
class CreateOrderDto {
}
__decorate([
    class_transformer_1.Transform((v) => +v),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "amount", void 0);
__decorate([
    class_validator_1.MaxLength(5),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "currency", void 0);
__decorate([
    class_validator_1.ValidateNested(),
    __metadata("design:type", OrderMeta)
], CreateOrderDto.prototype, "notes", void 0);
exports.CreateOrderDto = CreateOrderDto;
//# sourceMappingURL=CreateOrder.dto.js.map