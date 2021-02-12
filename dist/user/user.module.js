"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const user_schema_1 = require("./schemas/user.schema");
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const auth_module_1 = require("../auth/auth.module");
const forgot_password_schema_1 = require("./schemas/forgot-password.schema");
const admin_action_schema_1 = require("./schemas/admin-action.schema");
const platform_express_1 = require("@nestjs/platform-express");
const mongoose_1 = require("@nestjs/mongoose");
let UserModule = class UserModule {
};
UserModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: "User", schema: user_schema_1.UserSchema },
                { name: "ForgotPassword", schema: forgot_password_schema_1.ForgotPasswordSchema },
                { name: "AdminAction", schema: admin_action_schema_1.AdminActionSchema }
            ]),
            platform_express_1.MulterModule.register({
                dest: "~/.upload/users",
            }),
            auth_module_1.AuthModule,
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map