import { Module, CacheModule, CacheInterceptor } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ArticleModule } from "./article/article.module";
import { LeadModule } from './lead/lead.module';
import { CampaignModule } from './campaign/campaign.module';
import { AgentModule } from './agent/agent.module';
import { APP_INTERCEPTOR } from "@nestjs/core";


@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    AuthModule,
    ArticleModule,
    LeadModule,
    CampaignModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
