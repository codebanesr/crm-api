"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const roles_decorator_1 = require("./../auth/decorators/roles.decorator");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const common_1 = require("@nestjs/common");
const create_user_dto_1 = require("./dto/create-user.dto");
const verify_uuid_dto_1 = require("./dto/verify-uuid.dto");
const user_service_1 = require("./user.service");
const passport_1 = require("@nestjs/passport");
const refresh_access_token_dto_1 = require("./dto/refresh-access-token.dto");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/guards/roles.guard");
const platform_express_1 = require("@nestjs/platform-express");
const fileUpload_dto_1 = require("./dto/fileUpload.dto");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const find_all_dto_1 = require("../lead/dto/find-all.dto");
const create_forgot_password_dto_1 = require("./dto/create-forgot-password.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    register(createUserDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization } = user;
            return this.userService.create(createUserDto, organization);
        });
    }
    getAllUsersHack(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization } = user;
            return this.userService.getAllUsersHack(organization);
        });
    }
    getUserById(user, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization } = user;
            return this.userService.getUserById(userid, organization);
        });
    }
    verifyEmail(req, verifyUuidDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.verifyEmail(req, verifyUuidDto);
        });
    }
    login(req, loginUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.login(req, loginUserDto);
        });
    }
    refreshAccessToken(refreshAccessTokenDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.refreshAccessToken(refreshAccessTokenDto);
        });
    }
    forgotPassword(req, createForgotPasswordDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.forgotPassword(req, createForgotPasswordDto);
        });
    }
    forgotPasswordVerify(req, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.forgotPasswordVerify(req, token);
        });
    }
    resetPassword(resetPasswordDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.resetPassword(resetPasswordDto);
        });
    }
    findAll(user, assigned, findAllDto) {
        const { organization } = user;
        return this.userService.getAll(user, assigned, findAllDto, organization);
    }
    managersForReassignment(user, assigned) {
        const { organization } = user;
        return this.userService.managersForReassignment(user.manages, organization);
    }
    add(req, assigned, file, user) {
        const { organization } = user;
        return this.userService.insertMany(req.user.id, file.path);
    }
    updateUser(userid, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.updateUser(userid, user);
        });
    }
};
__decorate([
    common_1.Post(),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("admin"),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    swagger_1.ApiOperation({ summary: "Register user" }),
    swagger_1.ApiCreatedResponse({}),
    __param(0, common_1.Body()),
    __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    common_1.Get(),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({ summary: "Gets all users without filter, quick prototype" }),
    swagger_1.ApiOperation({ summary: "Get users hack" }),
    __param(0, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsersHack", null);
__decorate([
    common_1.Get("single/:id"),
    roles_decorator_1.Roles("admin"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({ summary: "Gets all users without filter, quick prototype" }),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    common_1.Post("verify-email"),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOperation({ summary: "Verify Email" }),
    swagger_1.ApiOkResponse({}),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, verify_uuid_dto_1.VerifyUuidDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyEmail", null);
__decorate([
    common_1.Post("login"),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOperation({ summary: "Login User" }),
    swagger_1.ApiOkResponse({}),
    __param(0, common_1.Req()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    common_1.Post("refresh-access-token"),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    swagger_1.ApiOperation({ summary: "Refresh Access Token with refresh token" }),
    swagger_1.ApiCreatedResponse({}),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_access_token_dto_1.RefreshAccessTokenDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refreshAccessToken", null);
__decorate([
    common_1.Post("forgot-password"),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOperation({ summary: "Forgot password" }),
    swagger_1.ApiOkResponse({}),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_forgot_password_dto_1.CreateForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
__decorate([
    common_1.Get("forgot-password-verify/:token"),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOperation({ summary: "Verfiy forget password code" }),
    swagger_1.ApiOkResponse({}),
    __param(0, common_1.Req()),
    __param(1, common_1.Param("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, verify_uuid_dto_1.VerifyUuidDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPasswordVerify", null);
__decorate([
    common_1.Post("reset-password"),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOperation({ summary: "Reset password after verify reset password" }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiHeader({
        name: "Bearer",
        description: "the token we need for auth.",
    }),
    swagger_1.ApiOkResponse({}),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    common_1.Get("allUsers"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({ summary: "Gets all users" }),
    swagger_1.ApiHeader({
        name: "Bearer",
        description: "the token we need for auth.",
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOkResponse({}),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Query("assigned")),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, find_all_dto_1.FindAllDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    common_1.Get("managersForReassignment"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({ summary: "Gets all users" }),
    swagger_1.ApiHeader({
        name: "Bearer",
        description: "the token we need for auth.",
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOkResponse({}),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Query("assigned")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "managersForReassignment", null);
__decorate([
    common_1.Post("many"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("user"),
    swagger_1.ApiOperation({ summary: "Add users in bulk from excel file" }),
    swagger_1.ApiHeader({
        name: "Bearer",
        description: "the token we need for auth.",
    }),
    swagger_1.ApiConsumes("multipart/form-data"),
    swagger_1.ApiBody({
        description: "List of Users",
        type: fileUpload_dto_1.FileUploadDto,
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOkResponse({}),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("file")),
    __param(0, common_1.Request()),
    __param(1, common_1.Query("assigned")),
    __param(2, common_1.UploadedFile()),
    __param(3, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "add", null);
__decorate([
    common_1.Put(":id"),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOperation({ summary: "Reset password after verify reset password" }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("admin"),
    swagger_1.ApiHeader({
        name: "Bearer",
        description: "the token we need for auth.",
    }),
    swagger_1.ApiOkResponse({}),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
UserController = __decorate([
    swagger_1.ApiTags("User"),
    common_1.Controller("user"),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map