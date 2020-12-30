import { Module, CacheModule, CacheInterceptor } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ArticleModule } from "./article/article.module";
import { LeadModule } from "./lead/lead.module";
import { CampaignModule } from "./campaign/campaign.module";
import { AgentModule } from "./agent/agent.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { OrganizationModule } from "./organization/organization.module";
import { SharedModule } from "./shared/shared.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { UploadService } from "./upload/upload.service";
import { PushNotificationService } from "./push-notification/push-notification.service";
import Config from "./config";
// import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    // LoggerModule.forRoot(),
    CacheModule.register(),
    MongooseModule.forRoot(Config.MONGODB_URI),
    UserModule,
    AuthModule,
    ArticleModule,
    LeadModule,
    CampaignModule,
    AgentModule,
    OrganizationModule,
    SharedModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    UploadService,
    PushNotificationService,
  ],
})
export class AppModule {}
