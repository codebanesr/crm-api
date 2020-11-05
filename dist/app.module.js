"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const article_module_1 = require("./article/article.module");
const lead_module_1 = require("./lead/lead.module");
const campaign_module_1 = require("./campaign/campaign.module");
const agent_module_1 = require("./agent/agent.module");
const core_1 = require("@nestjs/core");
const organization_module_1 = require("./organization/organization.module");
const shared_module_1 = require("./shared/shared.module");
const serve_static_module_1 = require("@nestjs/serve-static/dist/serve-static.module");
const path_1 = require("path");
const dashboard_module_1 = require("./dashboard/dashboard.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register(),
            serve_static_module_1.ServeStaticModule.forRoot({
                rootPath: path_1.join(__dirname, "..", "client"),
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            article_module_1.ArticleModule,
            lead_module_1.LeadModule,
            campaign_module_1.CampaignModule,
            agent_module_1.AgentModule,
            organization_module_1.OrganizationModule,
            shared_module_1.SharedModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_1.CacheInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map