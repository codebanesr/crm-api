import { UserModule } from "./user/user.module";
import { ArticleModule } from "./article/article.module";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { warn } from "console";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { LeadModule } from "./lead/lead.module";
import { CampaignModule } from "./campaign/campaign.module";
import { AgentModule } from "./agent/agent.module";
import { OrganizationModule } from "./organization/organization.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      transform: true,
    })
  );

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
  .setTitle("API")
  .setDescription("API description")
  .setVersion("1.0")
  .addTag("API")
  .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [
      UserModule,
      ArticleModule,
      LeadModule,
      CampaignModule,
      AgentModule,
      OrganizationModule,
    ],
  });
  SwaggerModule.setup("api/swagger", app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  warn(`APP IS LISTENING TO PORT ${PORT}`);
}
bootstrap();
