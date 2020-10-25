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
exports.SyncCallLogsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SyncCallLogsDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: 'shanur@gcsns.com',
        description: 'Old users email',
        format: 'number',
        default: null
    }),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], SyncCallLogsDto.prototype, "date", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: '9199946568',
        description: 'Phone number from call logs',
        type: String,
        default: null
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SyncCallLogsDto.prototype, "number", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 33333
    }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], SyncCallLogsDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 33333
    }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], SyncCallLogsDto.prototype, "duration", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 33333
    }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], SyncCallLogsDto.prototype, "new", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 33333
    }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], SyncCallLogsDto.prototype, "cachedNumberType", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "account identifier"
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SyncCallLogsDto.prototype, "phoneAccountId", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 33333
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SyncCallLogsDto.prototype, "viaNumber", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "shanur rahman"
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SyncCallLogsDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "shubham nitap"
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SyncCallLogsDto.prototype, "contact", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "this will be replaced by IsUrl"
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SyncCallLogsDto.prototype, "photo", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SyncCallLogsDto.prototype, "thumbPhoto", void 0);
exports.SyncCallLogsDto = SyncCallLogsDto;
//# sourceMappingURL=sync-call-logs.dto.js.map