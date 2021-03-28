"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModule = void 0;
const common_1 = require("@nestjs/common");
const agent_controller_1 = require("./agent.controller");
const agent_service_1 = require("./agent.service");
const mongoose_1 = require("@nestjs/mongoose");
const admin_action_schema_1 = require("../user/schemas/admin-action.schema");
const user_schema_1 = require("../user/schemas/user.schema");
const visit_track_schema_1 = require("./schemas/visit-track.schema");
let AgentModule = class AgentModule {
};
AgentModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'AdminAction', schema: admin_action_schema_1.AdminActionSchema },
                { name: 'User', schema: user_schema_1.UserSchema },
                { name: 'VisitTrack', schema: visit_track_schema_1.VisitTrackSchema }
            ])
        ],
        controllers: [agent_controller_1.AgentController],
        providers: [agent_service_1.AgentService]
    })
], AgentModule);
exports.AgentModule = AgentModule;
//# sourceMappingURL=agent.module.js.map