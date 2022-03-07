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
const dashboard_module_1 = require("./dashboard/dashboard.module");
const upload_service_1 = require("./upload/upload.service");
const push_notification_service_1 = require("./push-notification/push-notification.service");
const rules_module_1 = require("./rules/rules.module");
const nestjs_pino_1 = require("nestjs-pino");
const pino_1 = require("pino");
const order_module_1 = require("./order/order.module");
const razorpay_module_1 = require("./razorpay/razorpay.module");
const config_1 = require("./config/config");
const nestjs_config_1 = require("nestjs-config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path_1.join(__dirname, '..', 'client'),
            }),
            nestjs_config_1.ConfigModule.load("./config/config"),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    serializers: {
                        req: (req) => {
                            return {
                                id: req.id,
                                url: req.url,
                                body: req.body,
                                method: req.method,
                            };
                        },
                        res: pino_1.stdSerializers.res,
                        err: pino_1.stdSerializers.err,
                    },
                },
            }),
            common_1.CacheModule.register(),
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: () => ({
                    uri: config_1.default.MONGODB_URI,
                }),
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            article_module_1.ArticleModule,
            lead_module_1.LeadModule,
            campaign_module_1.CampaignModule,
            agent_module_1.AgentModule,
            organization_module_1.OrganizationModule,
            shared_module_1.SharedModule,
            dashboard_module_1.DashboardModule,
            rules_module_1.RulesModule,
            order_module_1.OrderModule,
            razorpay_module_1.RazorpayModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_1.CacheInterceptor,
            },
            upload_service_1.UploadService,
            push_notification_service_1.PushNotificationService
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map