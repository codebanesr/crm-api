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
exports.FindAllDto = exports.FiltersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const generic_enum_1 = require("../enum/generic.enum");
class FiltersDto {
    constructor() {
        this.dateRange = [];
        this.selectedCampaign = undefined;
    }
}
__decorate([
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], FiltersDto.prototype, "showArchived", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], FiltersDto.prototype, "showClosed", void 0);
__decorate([
    class_validator_1.IsEnum(generic_enum_1.AssignmentEnum),
    __metadata("design:type", String)
], FiltersDto.prototype, "assigned", void 0);
__decorate([
    class_validator_1.IsArray(),
    __metadata("design:type", Array)
], FiltersDto.prototype, "dateRange", void 0);
__decorate([
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], FiltersDto.prototype, "selectedCampaign", void 0);
__decorate([
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], FiltersDto.prototype, "leadStatusKeys", void 0);
__decorate([
    class_validator_1.IsEmail({}, { each: true }),
    __metadata("design:type", Array)
], FiltersDto.prototype, "handlers", void 0);
exports.FiltersDto = FiltersDto;
class FindAllDto {
    constructor() {
        this.page = 1;
        this.perPage = 20;
        this.sortBy = "createdAt";
        this.showCols = [];
        this.searchTerm = "";
    }
}
__decorate([
    swagger_1.ApiProperty({
        example: "1",
        description: "Page Number in paginated view",
        format: "number",
        default: 1,
    }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], FindAllDto.prototype, "page", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "15",
        description: "Number of records you want in selected page",
        format: "number",
        default: 15,
    }),
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], FindAllDto.prototype, "perPage", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "15",
        description: "The property you want to sort by",
        format: "string",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], FindAllDto.prototype, "sortBy", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: ["email", "leadStatus", "name"],
        description: "Cols to show in lead view",
        format: "string",
        default: "createdAt",
    }),
    class_validator_1.IsArray(),
    __metadata("design:type", Array)
], FindAllDto.prototype, "showCols", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: "sha",
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], FindAllDto.prototype, "searchTerm", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: {
            archived: false,
            assigned: true,
            dateRange: null,
            handlerEmail: "seniormanager@gmail.com",
            moduleTypes: null,
        },
    }),
    __metadata("design:type", FiltersDto)
], FindAllDto.prototype, "filters", void 0);
exports.FindAllDto = FindAllDto;
//# sourceMappingURL=find-all.dto.js.map