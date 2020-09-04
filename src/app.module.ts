import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ArticleModule } from "./article/article.module";
import { LeadModule } from './lead/lead.module';
import { CampaignModule } from './campaign/campaign.module';
import { AgentModule } from './agent/agent.module';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    AuthModule,
    ArticleModule,
    LeadModule,
    CampaignModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
