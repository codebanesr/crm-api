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
const moment = require("moment");
const nestjs_pino_1 = require("nestjs-pino");
let RulesService = class RulesService {
    constructor(logger) {
        this.logger = logger;
    }
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
    applyRules(campaignId, lead, leadDto, nextEntryInHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            const rules = yield this.ruleModel.find({ campaign: campaignId, isActive: true }).limit(4).lean().exec();
            let noa;
            let lastKDispositions;
            rules.forEach((rule) => __awaiter(this, void 0, void 0, function* () {
                switch (rule.trigger) {
                    case rules_constants_1.Trigger.changeHandler: {
                        this.triggerAction(rule, lead, leadDto, nextEntryInHistory);
                        break;
                    }
                    case rules_constants_1.Trigger.dispositionChange: {
                        const { fromDisposition, toDisposition } = rule;
                        if (lead.leadStatus === fromDisposition && leadDto.leadStatus === toDisposition) {
                            this.triggerAction(rule, lead, leadDto, nextEntryInHistory);
                        }
                        break;
                    }
                    case rules_constants_1.Trigger.numberOfAttempts: {
                        if (!noa) {
                            noa = yield this.leadHistoryModel.countDocuments({ lead: lead._id });
                        }
                        if (noa > rule.numberOfAttempts) {
                            this.triggerAction(rule, lead, leadDto, nextEntryInHistory);
                        }
                        break;
                    }
                    case rules_constants_1.Trigger.overdueFollowups: {
                        const followUp = moment(lead.followUp);
                        const today = moment();
                        if (today.diff(followUp, 'days') > rule.daysOverdue) {
                            this.triggerAction(rule, lead, leadDto, nextEntryInHistory);
                        }
                        break;
                    }
                    case rules_constants_1.Trigger.repeatedDisposition: {
                        const k = rule.numberOfAttempts;
                        if (!lastKDispositions) {
                            lastKDispositions = yield this.leadHistoryModel.find({ lead: lead._id }).sort({ updatedAt: -1 }).limit(k).lean().exec();
                        }
                        if (lastKDispositions.length === k && lastKDispositions.every(d => d === rule.disposition)) {
                            this.triggerAction(rule, lead, leadDto, nextEntryInHistory);
                        }
                        break;
                    }
                }
            }));
            return { lead, nextEntryInHistory };
        });
    }
    triggerAction(rule, lead, leadDto, nextEntryInHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newDisposition, action, newHandler } = rule;
            if (action === rules_constants_1.EActions.changeDisposition) {
                leadDto.leadStatus = newDisposition;
                nextEntryInHistory.leadStatus = newDisposition;
                nextEntryInHistory.notes += `\n, changed due to rule ${rule._id}`;
            }
            else if (action === rules_constants_1.EActions.callApi) {
                this.callApiAction(lead, rule.url);
                nextEntryInHistory.notes += `\n API called`;
            }
            else if (action === rules_constants_1.EActions.changeProspectHandler) {
                nextEntryInHistory.notes += `\n prospect handler changed from ${leadDto.email} to ${newHandler} for rule ${rule._id}`;
                leadDto.email = newHandler;
            }
            else {
                this.logger.log("No action matched the trigger in rules.service.ts!!!!!");
            }
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
__decorate([
    mongoose_1.InjectModel("LeadHistory"),
    __metadata("design:type", mongoose_2.Model)
], RulesService.prototype, "leadHistoryModel", void 0);
RulesService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [nestjs_pino_1.Logger])
], RulesService);
exports.RulesService = RulesService;
//# sourceMappingURL=rules.service.js.map