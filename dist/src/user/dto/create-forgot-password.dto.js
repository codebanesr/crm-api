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
exports.CreateForgotPasswordDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateForgotPasswordDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: 'pejman@gmail.com',
        description: 'The email of the User',
        format: 'email',
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
], CreateForgotPasswordDto.prototype, "email", void 0);
exports.CreateForgotPasswordDto = CreateForgotPasswordDto;
//# sourceMappingURL=create-forgot-password.dto.js.map