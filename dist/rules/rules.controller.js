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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const changeState_dto_1 = require("./dto/changeState.dto");
const rule_dto_1 = require("./dto/rule.dto");
const rules_service_1 = require("./rules.service");
let RulesController = class RulesController {
    constructor(rulesService) {
        this.rulesService = rulesService;
    }
    getAllRules(limit, offset, campaignId) {
        return this.rulesService.getAllRules(campaignId, limit, offset);
    }
    getRuleById(ruleId) {
        return this.rulesService.getRuleById(ruleId);
    }
    addRule(ruleDto) {
        return this.rulesService.addRule(ruleDto);
    }
    changeRuleState(changeStateDto) {
        return this.rulesService.changeState(changeStateDto);
    }
};
__decorate([
    common_1.Get("/all/:campaignId"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Query('limit')), __param(1, common_1.Query('offset')), __param(2, common_1.Param('campaignId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], RulesController.prototype, "getAllRules", null);
__decorate([
    common_1.Get(":id"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RulesController.prototype, "getRuleById", null);
__decorate([
    common_1.Post(),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rule_dto_1.RuleDto]),
    __metadata("design:returntype", void 0)
], RulesController.prototype, "addRule", null);
__decorate([
    common_1.Post("changeState"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [changeState_dto_1.ChangeStateDto]),
    __metadata("design:returntype", void 0)
], RulesController.prototype, "changeRuleState", null);
RulesController = __decorate([
    swagger_1.ApiTags('Rules'),
    common_1.Controller('rules'),
    __metadata("design:paramtypes", [rules_service_1.RulesService])
], RulesController);
exports.RulesController = RulesController;
//# sourceMappingURL=rules.controller.js.map