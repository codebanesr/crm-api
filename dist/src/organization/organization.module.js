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
const config_1 = require("../config");
const nestjs_redis_1 = require("nestjs-redis");
const shared_module_1 = require("../shared/shared.module");
const user_module_1 = require("../user/user.module");
let OrganizationModule = class OrganizationModule {
};
OrganizationModule = __decorate([
    common_1.Module({
        imports: [
            shared_module_1.SharedModule,
            user_module_1.UserModule,
            nestjs_redis_1.RedisModule.register(config_1.default.redisOpts),
            twilio_nestjs_1.TwilioModule.register({
                accountSid: config_1.default.twilio.accountSid,
                authToken: config_1.default.twilio.authToken,
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: "Organization", schema: organization_schema_1.OrganizationSchema }
            ]),
        ],
        providers: [organization_service_1.OrganizationService],
        controllers: [organization_controller_1.OrganizationController]
    })
], OrganizationModule);
exports.OrganizationModule = OrganizationModule;
//# sourceMappingURL=organization.module.js.map