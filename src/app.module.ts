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
import { OrganizationModule } from './organization/organization.module';
import { SharedModule } from './shared/shared.module';
import { ServeStaticModule } from "@nestjs/serve-static/dist/serve-static.module";
import { join } from "path";


@Module({
  imports: [
    CacheModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    AuthModule,
    ArticleModule,
    LeadModule,
    CampaignModule,
    AgentModule,
    OrganizationModule,
    SharedModule,
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
