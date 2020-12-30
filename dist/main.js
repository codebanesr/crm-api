"use strict";
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
const user_module_1 = require("./user/user.module");
const article_module_1 = require("./article/article.module");
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const console_1 = require("console");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const lead_module_1 = require("./lead/lead.module");
const campaign_module_1 = require("./campaign/campaign.module");
const agent_module_1 = require("./agent/agent.module");
const organization_module_1 = require("./organization/organization.module");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors();
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
        }));
        app.setGlobalPrefix('api');
        const options = new swagger_1.DocumentBuilder()
            .setTitle("API")
            .setDescription("API description")
            .setVersion("1.0")
            .addTag("API")
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options, {
            include: [
                user_module_1.UserModule,
                article_module_1.ArticleModule,
                lead_module_1.LeadModule,
                campaign_module_1.CampaignModule,
                agent_module_1.AgentModule,
                organization_module_1.OrganizationModule,
            ],
        });
        swagger_1.SwaggerModule.setup("swagger", app, document);
        const PORT = process.env.PORT || 3000;
        yield app.listen(PORT);
        console_1.warn(process.env.NODE_ENV);
        console_1.warn(`APP IS LISTENING TO PORT ${PORT}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map