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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const role_type_enum_1 = require("../../shared/role-type.enum");
class CreateUserDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: "pejman hadavi",
        description: "The name of the User",
        format: "string",
        minLength: 6,
        maxLength: 255,
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.MinLength(5),
    class_validator_1.MaxLength(255),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "pejman@gmail.com",
        description: "The email of the User",
        format: "email",
        uniqueItems: true,
        minLength: 5,
        maxLength: 255,
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.MinLength(5),
    class_validator_1.MaxLength(255),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "secret password change me!",
        description: "The password of the User",
        format: "string",
        minLength: 5,
        maxLength: 1024,
    }),
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.MinLength(5),
    class_validator_1.MaxLength(1024),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "manager",
        description: "Users role type",
        format: "string",
        minLength: 5,
        maxLength: 1024,
    }),
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEnum(role_type_enum_1.RoleType),
    class_validator_1.MinLength(5),
    class_validator_1.MaxLength(1024),
    __metadata("design:type", String)
], CreateUserDto.prototype, "roleType", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "seniorManager@gmail.com",
        description: "Who will he report to",
        type: String,
    }),
    class_validator_1.ValidateIf((o) => o.roleType !== role_type_enum_1.RoleType.admin),
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "reportsTo", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "phoneNumber",
        description: "Phone number of the user being created",
        format: "string",
        minLength: 5,
        maxLength: 14,
    }),
    class_transformer_1.Transform(value => value.toString()),
    class_validator_1.IsPhoneNumber('IN'),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phoneNumber", void 0);
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map