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
const lodash_1 = require("lodash");
const core_config_1 = require("./core-config");
const moment = require("moment");
let CampaignService = class CampaignService {
    constructor(campaignModel, campaignConfigModel, dispositionModel, adminActionModel, campaignFormModel, leadModel) {
        this.campaignModel = campaignModel;
        this.campaignConfigModel = campaignConfigModel;
        this.dispositionModel = dispositionModel;
        this.adminActionModel = adminActionModel;
        this.campaignFormModel = campaignFormModel;
        this.leadModel = leadModel;
    }
    findAll({ page, perPage, filters, sortBy, loggedInUserId, organization, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = Number(perPage);
            const skip = Number((page - 1) * limit);
            const campaignAgg = this.campaignModel.aggregate();
            const { campaigns = [], select = [] } = filters;
            campaignAgg.match({
                $or: [{ createdBy: loggedInUserId }, { assignees: loggedInUserId }],
            });
            if (campaigns && campaigns.length > 0) {
                campaignAgg.match({ type: { $in: campaigns } });
            }
            if (select.length > 0) {
                const project = {};
                select.forEach(s => {
                    project[s] = 1;
                });
                campaignAgg.project(project);
            }
            campaignAgg.facet({
                metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
                data: [{ $skip: skip }, { $limit: limit }],
            });
            const result = yield campaignAgg.exec();
            const campaignIds = result[0].data.map((d) => d._id);
            const quickStatsAgg = yield this.getQuickStatsForCampaigns(campaignIds, organization);
            return {
                data: result[0].data,
                metadata: result[0].metadata[0],
                quickStatsAgg,
            };
        });
    }
    findOneByIdOrName(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.campaignModel.findById(campaignId).lean().exec();
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
    getCampaignTypes(hint, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.campaignModel
                .find({
                campaignName: { $regex: "^" + hint, $options: "I" },
                organization,
            })
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
            if (!campaignId || campaignId == "core") {
                return this.defaultDisposition();
            }
            else {
                return this.dispositionModel
                    .findOne({ campaign: campaignId })
                    .sort({ _id: -1 })
                    .lean()
                    .exec();
            }
        });
    }
    uploadConfig(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = file.path;
            const excelObject = parseExcel_1.default(path);
        });
    }
    createCampaignAndDisposition({ activeUserId, dispositionData, campaignInfo, organization, editableCols, browsableCols, formModel, uniqueCols, assignTo, advancedSettings, groups, isNew, autodialSettings }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNew) {
                browsableCols = core_config_1.coreConfig.map(c => c.internalField);
                editableCols = browsableCols;
                uniqueCols = ['mobilePhone'];
            }
            const campaign = yield this.campaignModel.findOneAndUpdate({ campaignName: campaignInfo.campaignName, organization }, Object.assign(Object.assign({}, campaignInfo), { createdBy: activeUserId, organization,
                browsableCols,
                editableCols,
                uniqueCols,
                formModel,
                advancedSettings,
                assignTo,
                groups,
                autodialSettings }), { new: true, upsert: true, rawResult: true });
            if (isNew) {
                core_config_1.coreConfig.forEach(config => {
                    config.organization = organization;
                    config.campaignId = campaign.value._id;
                });
                yield this.campaignConfigModel.insertMany(core_config_1.coreConfig);
            }
            const disposition = yield this.dispositionModel.findOneAndUpdate({ campaign: campaign.value.id, organization }, {
                options: dispositionData,
                campaign: campaign.value.id,
            }, { new: true, upsert: true, rawResult: true });
            return {
                campaign: campaign.value,
                disposition,
            };
        });
    }
    saveCampaignSchema(ccJSON, others) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = [];
            const updated = [];
            const error = [];
            for (const cc of ccJSON) {
                if (cc.type === "select") {
                    cc.options = cc.options.split(", ");
                }
                const { lastErrorObject, value } = yield this.campaignConfigModel
                    .findOneAndUpdate({
                    name: others.schemaName,
                    internalField: cc.internalField,
                    organization: others.schema,
                }, Object.assign(Object.assign({}, cc), { organization: others.organization }), { new: true, upsert: true, rawResult: true })
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
            const filePath = path_1.join(__dirname, "..", "..", "crm_response", filename);
            xlsx_1.writeFile(wb, filename);
            return filePath;
        });
    }
    getDispositionByCampaignName(campaignName, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.Logger.debug({ campaignName, organization });
            const campaignAgg = this.campaignModel.aggregate();
            campaignAgg.match({ campaignName, organization });
            campaignAgg.lookup({
                from: "dispositions",
                localField: "_id",
                foreignField: "campaign",
                as: "disposition",
            });
            campaignAgg.project({ disposition: "$disposition" });
            const result = yield campaignAgg.exec();
            return result[0].disposition[0];
        });
    }
    updateCampaignForm({ organization, payload, campaign }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.campaignFormModel.updateOne({ organization, campaign }, { $set: { payload } }, { upsert: true });
        });
    }
    archiveCampaign(campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.campaignModel.findByIdAndUpdate(campaign._id, {
                $set: { archived: campaign.archived },
            }, { new: true });
        });
    }
    getQuickStatsForCampaigns(campaignIds, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = moment().toDate();
            const quickStatsAgg = this.leadModel.aggregate();
            quickStatsAgg.match({
                organization,
                campaignId: { $in: campaignIds },
            });
            quickStatsAgg.group({
                _id: { campaign: "$campaign" },
                followUp: {
                    $sum: {
                        $cond: [
                            { $gt: ["$followUp", currentDate] },
                            1,
                            0,
                        ],
                    },
                },
                overdue: {
                    $sum: {
                        $cond: [
                            { $lt: ["$followUp", currentDate] },
                            1,
                            0,
                        ],
                    },
                },
            });
            quickStatsAgg.project({
                campaign: "$_id.campaign",
                followUp: "$followUp",
                overdue: "$overdue",
                _id: 0,
            });
            const quickStatsArr = yield quickStatsAgg.exec();
            return lodash_1.keyBy(quickStatsArr, "campaign");
        });
    }
    updateConfigs(config, organization, campaignId, campaignName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config._id)
                return this.campaignConfigModel.findOneAndUpdate({ _id: config._id }, Object.assign(Object.assign({}, config), { name: campaignName, organization, campaignId }), { upsert: true }).lean().exec();
            else {
                try {
                    return this.campaignConfigModel.create(Object.assign(Object.assign({}, config), { name: campaignName, organization, campaignId, checked: true }));
                }
                catch (e) {
                    throw new common_1.BadRequestException("possibly duplicate field for this campaign");
                }
            }
        });
    }
    createCampaignConfigs() {
    }
    deleteConfig(_id) {
        return this.campaignConfigModel.deleteOne({ _id });
    }
};
CampaignService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("Campaign")),
    __param(1, mongoose_1.InjectModel("CampaignConfig")),
    __param(2, mongoose_1.InjectModel("Disposition")),
    __param(3, mongoose_1.InjectModel("AdminAction")),
    __param(4, mongoose_1.InjectModel("CampaignForm")),
    __param(5, mongoose_1.InjectModel("Lead")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CampaignService);
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.service.js.map