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
exports.FindCampaignsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class FindCampaignsDto {
    constructor() {
        this.page = 1;
        this.perPage = 20;
        this.filters = {};
        this.sortBy = "handler";
    }
}
__decorate([
    swagger_1.ApiProperty({
        type: Number,
        description: "Current page you are looking at",
        default: 1
    }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], FindCampaignsDto.prototype, "page", void 0);
__decorate([
    swagger_1.ApiProperty({
        type: Number,
        description: "Number of records per page required",
        default: 20
    }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], FindCampaignsDto.prototype, "perPage", void 0);
__decorate([
    swagger_1.ApiProperty({
        required: false,
        type: JSON,
        description: "List of filters to be applied, docs will be added on request"
    }),
    class_validator_1.Allow(),
    __metadata("design:type", Object)
], FindCampaignsDto.prototype, "filters", void 0);
__decorate([
    swagger_1.ApiProperty({
        type: String,
        required: false,
        description: "The campaign property to sort campaigns "
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], FindCampaignsDto.prototype, "sortBy", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], FindCampaignsDto.prototype, "select", void 0);
exports.FindCampaignsDto = FindCampaignsDto;
//# sourceMappingURL=find-campaigns.dto.js.map