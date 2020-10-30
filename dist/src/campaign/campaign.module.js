"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignModule = void 0;
const common_1 = require("@nestjs/common");
const campaign_service_1 = require("./campaign.service");
const campaign_controller_1 = require("./campaign.controller");
const mongoose_1 = require("@nestjs/mongoose");
const campaign_schema_1 = require("./schema/campaign.schema");
const campaign_config_schema_1 = require("../lead/schema/campaign-config.schema");
const disposition_schema_1 = require("./schema/disposition.schema");
const platform_express_1 = require("@nestjs/platform-express");
const admin_action_schema_1 = require("../user/schemas/admin-action.schema");
const campaign_form_schema_1 = require("./schema/campaign-form.schema");
let CampaignModule = class CampaignModule {
};
CampaignModule = __decorate([
    common_1.Module({
        imports: [
            platform_express_1.MulterModule.register({
                dest: "~/.upload",
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: "Campaign", schema: campaign_schema_1.CampaignSchema },
                { name: "CampaignConfig", schema: campaign_config_schema_1.CampaignConfigSchema },
                { name: "Disposition", schema: disposition_schema_1.DispositionSchema },
                { name: "AdminAction", schema: admin_action_schema_1.AdminActionSchema },
                { name: "CampaignForm", schema: campaign_form_schema_1.CampaignFormSchema },
            ]),
        ],
        controllers: [campaign_controller_1.CampaignController],
        providers: [campaign_service_1.CampaignService],
    })
], CampaignModule);
exports.CampaignModule = CampaignModule;
//# sourceMappingURL=campaign.module.js.map