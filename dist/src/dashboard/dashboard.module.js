"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const campaign_schema_1 = require("../campaign/schema/campaign.schema");
const call_log_schema_1 = require("../lead/schema/call-log.schema");
const campaign_config_schema_1 = require("../lead/schema/campaign-config.schema");
const email_templates_schema_1 = require("../lead/schema/email-templates.schema");
const geo_location_schema_1 = require("../lead/schema/geo-location.schema");
const lead_schema_1 = require("../lead/schema/lead.schema");
const user_schema_1 = require("../user/schemas/user.schema");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
let DashboardModule = class DashboardModule {
};
DashboardModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: "Campaign", schema: campaign_schema_1.CampaignSchema },
                { name: "GeoLocation", schema: geo_location_schema_1.GeoLocationSchema },
                { name: "CallLog", schema: call_log_schema_1.CallLogSchema },
                { name: "EmailTemplate", schema: email_templates_schema_1.EmailTemplateSchema },
                { name: "CampaignConfig", schema: campaign_config_schema_1.CampaignConfigSchema },
                { name: "User", schema: user_schema_1.UserSchema },
                { name: "Lead", schema: lead_schema_1.LeadSchema }
            ]),
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService]
    })
], DashboardModule);
exports.DashboardModule = DashboardModule;
//# sourceMappingURL=dashboard.module.js.map