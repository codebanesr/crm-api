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
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const parseExcel_1 = require("../utils/parseExcel");
const xlsx_1 = require("xlsx");
const path_1 = require("path");
let CampaignService = class CampaignService {
    constructor(campaignModel, campaignConfigModel, dispositionModel, adminActionModel) {
        this.campaignModel = campaignModel;
        this.campaignConfigModel = campaignConfigModel;
        this.dispositionModel = dispositionModel;
        this.adminActionModel = adminActionModel;
    }
    findAll(page, perPage, filters, sortBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = Number(perPage);
            const skip = Number((page - 1) * limit);
            const { createdBy, campaigns = [] } = filters;
            const matchQ = {};
            matchQ.$and = [];
            if (createdBy) {
                matchQ.$and.push({ createdBy: createdBy });
            }
            if (campaigns && campaigns.length > 0) {
                matchQ.$and.push({ type: { $in: campaigns } });
            }
            const fq = [
                { $match: matchQ },
                { $sort: { [sortBy]: 1 } },
                {
                    '$facet': {
                        metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
                        data: [{ $skip: skip }, { $limit: limit }]
                    }
                }
            ];
            if (fq[0]["$match"]["$and"].length === 0) {
                delete fq[0]["$match"]["$and"];
            }
            console.log(JSON.stringify(fq));
            const result = yield this.campaignModel.aggregate(fq);
            return { data: result[0].data, metadata: result[0].metadata[0] };
        });
    }
    findOneByIdOrName(campaignId, identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            switch (identifier) {
                case "campaignName":
                    result = yield this.campaignModel
                        .findOne({ campaignName: campaignId })
                        .sort({ updatedAt: -1 })
                        .lean()
                        .exec();
                    break;
                default:
                    result = yield this.campaignModel
                        .findById(campaignId)
                        .lean()
                        .exec();
            }
            return result;
        });
    }
    patch(campaignId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateOps = {};
            for (const ops of requestBody) {
                const propName = ops.propName;
                updateOps[propName] = ops.value;
            }
            return this.campaignModel.update({ _id: campaignId }, { $set: updateOps });
        });
    }
    deleteOne(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = campaignId;
            return this.campaignModel.remove({ _id: id });
        });
    }
    getHandlerEmailHints(partialEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 15;
            const result = yield this.campaignModel.aggregate([
                {
                    $match: {
                        handler: { $regex: `^${partialEmail}` },
                    },
                },
                {
                    $project: { handler: 1, _id: 0 },
                },
                { $limit: limit },
            ]);
            return result.map((r) => r.handler);
        });
    }
    getCampaignTypes(hint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.campaignModel
                .find({ campaignName: { $regex: "^" + hint, $options: "I" } })
                .limit(20);
        });
    }
    defaultDisposition() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let disposition = yield this.dispositionModel.findOne({
                    campaign: "5ee225b99580594afd8561dd",
                });
                if (!disposition) {
                    return {
                        error: "Core campaign schema not found, verify that creator id exists in user schema and campaignId in campaign schema... This is for core config. Also remember that during populate mongoose will look for these ids",
                    };
                }
                return disposition;
            }
            catch (e) {
                return { e: e.message };
            }
        });
    }
    getDispositionForCampaign(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (campaignId == "core") {
                return this.defaultDisposition();
            }
            else {
                return this.dispositionModel.findOne({ campaign: campaignId }).sort({ _id: 1 });
            }
        });
    }
    uploadConfig(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = file.path;
            const excelObject = parseExcel_1.default(path);
        });
    }
    createCampaignAndDisposition(activeUserId, file, dispositionData, campaignInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            dispositionData = JSON.parse(dispositionData);
            campaignInfo = JSON.parse(campaignInfo);
            const ccJSON = parseExcel_1.default(file.path);
            const campaign = yield this.campaignModel.findOneAndUpdate({ campaignName: campaignInfo.campaignName }, Object.assign(Object.assign({}, campaignInfo), { createdBy: activeUserId }), { new: true, upsert: true, rawResult: true });
            const filePath = yield this.saveCampaignSchema(ccJSON, {
                schemaName: campaignInfo.campaignName,
            });
            const adminActions = new this.adminActionModel({
                userid: activeUserId,
                actionType: "error",
                filePath,
                savedOn: "disk",
                fileType: "campaignConfig"
            });
            adminActions.save();
            let disposition = new this.dispositionModel({
                options: dispositionData,
                campaign: campaign.value.id,
            });
            disposition = yield disposition.save();
            return {
                campaign: campaign.value,
                disposition,
                filePath,
            };
        });
    }
    saveCampaignSchema(ccJSON, others) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = [];
            const updated = [];
            const error = [];
            for (const cc of ccJSON) {
                if (cc.type === 'select') {
                    cc.options = cc.options.split(", ");
                }
                const { lastErrorObject, value } = yield this.campaignConfigModel
                    .findOneAndUpdate({ name: others.schemaName, internalField: cc.internalField }, cc, { new: true, upsert: true, rawResult: true })
                    .lean()
                    .exec();
                if (lastErrorObject.updatedExisting === true) {
                    updated.push(value);
                }
                else if (lastErrorObject.upserted) {
                    created.push(value);
                }
                else {
                    error.push(value);
                }
            }
            const created_ws = xlsx_1.utils.json_to_sheet(created);
            const updated_ws = xlsx_1.utils.json_to_sheet(updated);
            const wb = xlsx_1.utils.book_new();
            xlsx_1.utils.book_append_sheet(wb, updated_ws, "tickets updated");
            xlsx_1.utils.book_append_sheet(wb, created_ws, "tickets created");
            const filename = `campaignSchema.xlsx`;
            const filePath = path_1.join(__dirname, '..', '..', "crm_response", filename);
            xlsx_1.writeFile(wb, filename);
            return filePath;
        });
    }
};
CampaignService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("Campaign")),
    __param(1, mongoose_1.InjectModel("CampaignConfig")),
    __param(2, mongoose_1.InjectModel("Disposition")),
    __param(3, mongoose_1.InjectModel("AdminAction")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CampaignService);
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.service.js.map