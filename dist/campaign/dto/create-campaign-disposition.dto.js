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
exports.CreateCampaignAndDispositionDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCampaignAndDispositionDto {
}
__decorate([
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], CreateCampaignAndDispositionDto.prototype, "editableCols", void 0);
__decorate([
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], CreateCampaignAndDispositionDto.prototype, "browsableCols", void 0);
__decorate([
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], CreateCampaignAndDispositionDto.prototype, "uniqueCols", void 0);
__decorate([
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], CreateCampaignAndDispositionDto.prototype, "assignTo", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], CreateCampaignAndDispositionDto.prototype, "isNew", void 0);
__decorate([
    class_validator_1.IsObject(),
    __metadata("design:type", Object)
], CreateCampaignAndDispositionDto.prototype, "autodialSettings", void 0);
exports.CreateCampaignAndDispositionDto = CreateCampaignAndDispositionDto;
//# sourceMappingURL=create-campaign-disposition.dto.js.map