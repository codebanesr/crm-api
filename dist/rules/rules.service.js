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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const mongoose_2 = require("mongoose");
const rules_constants_1 = require("./rules.constants");
const axios_1 = require("axios");
let RulesService = class RulesService {
    getRuleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ruleModel.findById(id).lean().exec();
        });
    }
    getAllRules(campaignId, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!class_validator_1.isMongoId(campaignId)) {
                throw new common_1.GoneException("Campaign Id is not a valid mongoId");
            }
            return this.ruleModel.find({ campaign: campaignId }).skip(offset).limit(limit).lean().exec();
        });
    }
    addRule(rule) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ruleModel.create(rule);
        });
    }
    changeState(changeStateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ruleModel.findOneAndUpdate({ _id: changeStateDto.ruleId }, { isActive: changeStateDto.isActive }, { new: true }).lean().exec();
        });
    }
    applyRules(campaignId, lead, history) {
        return __awaiter(this, void 0, void 0, function* () {
            const rules = yield this.ruleModel.find({ campaign: campaignId, isActive: true });
            rules.forEach(rule => {
                switch (rule.trigger) {
                    case rules_constants_1.Trigger.changeHandler: {
                        break;
                    }
                    case rules_constants_1.Trigger.dispositionChange: {
                        break;
                    }
                    case rules_constants_1.Trigger.numberOfAttempts: {
                        break;
                    }
                    case rules_constants_1.Trigger.overdueFollowups: {
                        break;
                    }
                    case rules_constants_1.Trigger.repeatedDisposition: {
                        break;
                    }
                }
            });
            return { lead, history };
        });
    }
    callApiAction(lead, url) {
        return __awaiter(this, void 0, void 0, function* () {
            url.replace(/\$First name\$/g, lead.firstName);
            url.replace(/\$Last name\$/g, lead.firstName);
            url.replace(/\$Full name\$/g, lead.firstName);
            yield axios_1.default.get(url);
        });
    }
};
__decorate([
    mongoose_1.InjectModel("Rule"),
    __metadata("design:type", mongoose_2.Model)
], RulesService.prototype, "ruleModel", void 0);
RulesService = __decorate([
    common_1.Injectable()
], RulesService);
exports.RulesService = RulesService;
//# sourceMappingURL=rules.service.js.map