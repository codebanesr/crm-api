import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminActionSchema } from '../user/schemas/admin-action.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'AdminAction', schema: AdminActionSchema}])
  ], 
  controllers: [AgentController],
  providers: [AgentService]
})
export class AgentModule {}
