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
exports.RuleDto = void 0;
const class_validator_1 = require("class-validator");
const rules_constants_1 = require("../rules.constants");
class RuleDto {
}
__decorate([
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], RuleDto.prototype, "campaign", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEnum(rules_constants_1.EActions),
    __metadata("design:type", String)
], RuleDto.prototype, "action", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RuleDto.prototype, "changeHandler", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.trigger === rules_constants_1.Trigger.overdueFollowups),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], RuleDto.prototype, "daysOverdue", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.trigger === rules_constants_1.Trigger.repeatedDisposition),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RuleDto.prototype, "disposition", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.trigger === rules_constants_1.Trigger.dispositionChange),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RuleDto.prototype, "fromDisposition", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.action === rules_constants_1.EActions.changeDisposition),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RuleDto.prototype, "newDisposition", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.action === rules_constants_1.EActions.changeProspectHandler),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], RuleDto.prototype, "newHandler", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.trigger === rules_constants_1.Trigger.numberOfAttempts),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], RuleDto.prototype, "numberOfAttempts", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.trigger === rules_constants_1.Trigger.dispositionChange),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RuleDto.prototype, "toDisposition", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEnum(rules_constants_1.Trigger),
    __metadata("design:type", String)
], RuleDto.prototype, "trigger", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.action === rules_constants_1.EActions.callApi),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsUrl(),
    __metadata("design:type", String)
], RuleDto.prototype, "url", void 0);
exports.RuleDto = RuleDto;
//# sourceMappingURL=rule.dto.js.map