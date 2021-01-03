"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadModule = void 0;
const common_1 = require("@nestjs/common");
const lead_service_1 = require("./lead.service");
const lead_controller_1 = require("./lead.controller");
const mongoose_1 = require("@nestjs/mongoose");
const lead_schema_1 = require("./schema/lead.schema");
const user_schema_1 = require("../user/schemas/user.schema");
const campaign_config_schema_1 = require("./schema/campaign-config.schema");
const email_templates_schema_1 = require("./schema/email-templates.schema");
const call_log_schema_1 = require("./schema/call-log.schema");
const geo_location_schema_1 = require("./schema/geo-location.schema");
const alarm_schema_1 = require("./schema/alarm.schema");
const campaign_schema_1 = require("../campaign/schema/campaign.schema");
const platform_express_1 = require("@nestjs/platform-express");
const admin_action_schema_1 = require("../user/schemas/admin-action.schema");
const upload_service_1 = require("../upload/upload.service");
const push_notification_service_1 = require("../push-notification/push-notification.service");
const lead_history_schema_1 = require("./schema/lead-history.schema");
let LeadModule = class LeadModule {
};
LeadModule = __decorate([
    common_1.Module({
        imports: [
            platform_express_1.MulterModule.register({
                dest: "~/.upload",
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: "Alarm", schema: alarm_schema_1.AlarmSchema },
                { name: "Campaign", schema: campaign_schema_1.CampaignSchema },
                { name: "GeoLocation", schema: geo_location_schema_1.GeoLocationSchema },
                { name: "CallLog", schema: call_log_schema_1.CallLogSchema },
                { name: "EmailTemplate", schema: email_templates_schema_1.EmailTemplateSchema },
                { name: "CampaignConfig", schema: campaign_config_schema_1.CampaignConfigSchema },
                { name: "User", schema: user_schema_1.UserSchema },
                { name: "Lead", schema: lead_schema_1.LeadSchema },
                { name: "AdminAction", schema: admin_action_schema_1.AdminActionSchema },
                { name: "LeadHistory", schema: lead_history_schema_1.LeadHistory },
            ]),
        ],
        providers: [lead_service_1.LeadService, upload_service_1.UploadService, push_notification_service_1.PushNotificationService],
        controllers: [lead_controller_1.LeadController],
    })
], LeadModule);
exports.LeadModule = LeadModule;
//# sourceMappingURL=lead.module.js.map