import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema, ResellerOrganizationSchema } from 'src/organization/schema';
import { UserSchema } from '../user/schemas/user.schema';
import { SharedService } from './shared.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Organization", schema: OrganizationSchema },
      { name: "ResellerOrganization", schema: ResellerOrganizationSchema },
    ]),
  ],
  providers: [SharedService],
  exports:[SharedService]
})
export class SharedModule {}
