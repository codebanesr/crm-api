"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesModule = void 0;
const common_1 = require("@nestjs/common");
const rules_service_1 = require("./rules.service");
const rules_controller_1 = require("./rules.controller");
const mongoose_1 = require("@nestjs/mongoose");
const rules_schema_1 = require("./rules.schema");
const lead_history_schema_1 = require("../lead/schema/lead-history.schema");
let RulesModule = class RulesModule {
};
RulesModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: "Rule", schema: rules_schema_1.RulesSchema },
                { name: "LeadHistory", schema: lead_history_schema_1.LeadHistory },
            ]),
        ],
        providers: [rules_service_1.RulesService],
        controllers: [rules_controller_1.RulesController],
        exports: [rules_service_1.RulesService]
    })
], RulesModule);
exports.RulesModule = RulesModule;
//# sourceMappingURL=rules.module.js.map