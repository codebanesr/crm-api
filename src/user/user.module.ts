import { UserSchema } from "./schemas/user.schema";
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";
import { ForgotPasswordSchema } from "./schemas/forgot-password.schema";
import { AdminActionSchema } from "./schemas/admin-action.schema";
import { MulterModule } from "@nestjs/platform-express";
import { MongooseModule } from "@nestjs/mongoose";
import { OrganizationSchema } from "../organization/schema/organization.schema";
import { SharedModule } from "src/shared/shared.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Organization", schema: OrganizationSchema },
      { name: "ForgotPassword", schema: ForgotPasswordSchema },
      { name: "AdminAction", schema: AdminActionSchema },
      // { name: "VisitTrack", schema: VisitTrackSchema },
    ]),
    MulterModule.register({
      dest: "~/.upload/users",
    }),
    AuthModule,
    SharedModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
