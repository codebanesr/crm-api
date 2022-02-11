"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationModule = void 0;
const common_1 = require("@nestjs/common");
const organization_service_1 = require("./organization.service");
const organization_controller_1 = require("./organization.controller");
const mongoose_1 = require("@nestjs/mongoose");
const organization_schema_1 = require("./schema/organization.schema");
const twilio_nestjs_1 = require("@lkaric/twilio-nestjs");
const config_1 = require("../config/config");
const nestjs_redis_1 = require("nestjs-redis");
const shared_module_1 = require("../shared/shared.module");
const reseller_organization_schema_1 = require("./schema/reseller-organization.schema");
const transaction_schema_1 = require("./schema/transaction.schema");
const campaign_form_schema_1 = require("../campaign/schema/campaign-form.schema");
const campaign_schema_1 = require("../campaign/schema/campaign.schema");
const disposition_schema_1 = require("../campaign/schema/disposition.schema");
const campaign_config_schema_1 = require("../lead/schema/campaign-config.schema");
const lead_schema_1 = require("../lead/schema/lead.schema");
const admin_action_schema_1 = require("../user/schemas/admin-action.schema");
let OrganizationModule = class OrganizationModule {
};
OrganizationModule = __decorate([
    common_1.Module({
        imports: [
            nestjs_redis_1.RedisModule.register(config_1.default.redisOpts),
            twilio_nestjs_1.TwilioModule.register({
                accountSid: config_1.default.twilio.accountSid,
                authToken: config_1.default.twilio.authToken,
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: "Organization", schema: organization_schema_1.OrganizationSchema },
                { name: "ResellerOrganization", schema: reseller_organization_schema_1.ResellerOrganizationSchema },
                { name: "Transaction", schema: transaction_schema_1.TransactionSchema },
                { name: "Campaign", schema: campaign_schema_1.CampaignSchema },
                { name: "Lead", schema: lead_schema_1.LeadSchema },
                { name: "CampaignConfig", schema: campaign_config_schema_1.CampaignConfigSchema },
                { name: "Disposition", schema: disposition_schema_1.DispositionSchema },
                { name: "AdminAction", schema: admin_action_schema_1.AdminActionSchema },
                { name: "CampaignForm", schema: campaign_form_schema_1.CampaignFormSchema },
            ]),
            shared_module_1.SharedModule,
        ],
        providers: [organization_service_1.OrganizationService],
        controllers: [organization_controller_1.OrganizationController],
    })
], OrganizationModule);
exports.OrganizationModule = OrganizationModule;
//# sourceMappingURL=organization.module.js.map