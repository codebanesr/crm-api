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
exports.FollowUpDto = exports.INTERVAL = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var INTERVAL;
(function (INTERVAL) {
    INTERVAL["TODAY"] = "TODAY";
    INTERVAL["THIS_WEEK"] = "THIS_WEEK";
    INTERVAL["THIS_MONTH"] = "THIS_MONTH";
})(INTERVAL = exports.INTERVAL || (exports.INTERVAL = {}));
class FollowUpDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: 'TODAY',
        description: `
            Add duration "TODAY", "THIS_WEEK", "THIS_MONTH", returns upcoming leads during
            that duration. Takes current date as the reference point
        `,
        format: 'number',
        default: 1
    }),
    class_validator_1.IsEnum(INTERVAL),
    __metadata("design:type", String)
], FollowUpDto.prototype, "interval", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], FollowUpDto.prototype, "userEmail", void 0);
exports.FollowUpDto = FollowUpDto;
//# sourceMappingURL=follow-up.dto.js.map