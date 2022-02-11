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
import { RulesModule } from "./rules/rules.module";
import { LoggerModule } from "nestjs-pino";
import { stdSerializers } from "pino";
import { OrderModule } from "./order/order.module";
import { RazorpayModule } from "./razorpay/razorpay.module";
import config from "./config/config";
import { ConfigModule, ConfigService } from "nestjs-config";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.load("./config/config"),
    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req: (req) => {
            // req has already been processed
            // see https://github.com/pinojs/pino-std-serializers#exportsreqrequest
            return {
              id: req.id,
              url: req.url,
              body: req.body,
              method: req.method,
            };
          },
          res: stdSerializers.res,
          err: stdSerializers.err,
        },
      },
    }),
    CacheModule.register(),
    // { useNewUrlParser: true } -> for atlas connection
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: config.MONGODB_URI,
      }),
    }),
    UserModule,
    AuthModule,
    ArticleModule,
    LeadModule,
    CampaignModule,
    AgentModule,
    OrganizationModule,
    SharedModule,
    DashboardModule,
    RulesModule,
    OrderModule,
    RazorpayModule,
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
