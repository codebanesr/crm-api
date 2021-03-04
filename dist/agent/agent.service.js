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
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const moment = require("moment");
let AgentService = class AgentService {
    constructor(adminActionModel, visitTrackModel, userModel) {
        this.adminActionModel = adminActionModel;
        this.visitTrackModel = visitTrackModel;
        this.userModel = userModel;
    }
    listActions(activeUserId, organization, skip, fileType, sortBy = "handler", me, campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            const fq = this.adminActionModel.aggregate();
            fq.match({ campaign: mongoose_2.Types.ObjectId(campaign) });
            if (me) {
                fq.match({ userid: activeUserId });
            }
            if (fileType) {
            }
            fq.lookup({
                from: "users",
                localField: "userid",
                foreignField: "_id",
                as: "userdetails",
            });
            fq.unwind({ path: "$userdetails" });
            fq.project({
                email: "$userdetails.email",
                savedOn: "$userdetails.savedOn",
                filePath: "$filePath",
                actionType: "$actionType",
                createdAt: "$createdAt",
                label: "$label",
            });
            fq.sort({ createdAt: -1 });
            fq.skip(Number(skip));
            fq.limit(20);
            const result = yield fq.exec();
            return result;
        });
    }
    downloadFile(location, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const readStream = fs_1.createReadStream(location);
            readStream.on("close", () => {
                res.end();
            });
            readStream.pipe(res);
        });
    }
    updateBatteryStatus(userId, batLvlDto) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.Logger.debug(`saving battery status  ${userId}, ${batLvlDto}, ${typeof batLvlDto.batLvl}, ${batLvlDto.batLvl}`);
            return this.visitTrackModel.findOneAndUpdate({ userId }, {
                $set: {
                    batLvl: batLvlDto.batLvl
                }
            }, { upsert: true });
        });
    }
    addVisitTrack(userId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.Logger.debug(`userid: ${userId}, coorinates: ${payload.coordinate}`);
            const start = moment().startOf('day');
            const end = moment().endOf('day');
            return this.visitTrackModel.findOneAndUpdate({ userId, createdAt: { $gte: start, $lt: end } }, {
                $push: {
                    locations: Object.assign(Object.assign({}, payload.coordinate), { timestamp: new Date() })
                }
            }, { upsert: true });
        });
    }
    getVisitTrack(id, roleType, organization, userLocationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            let subordinateIds = yield this.getSubordinates(id, roleType);
            subordinateIds = subordinateIds.map(s => s.toString());
            const { campaign, startDate, endDate, userIds } = userLocationDto;
            let validUserIds = lodash_1.intersection(userIds, subordinateIds);
            validUserIds = lodash_1.union(validUserIds, [id.toString()]);
            return this.visitTrackModel.find({
                userId: { $in: validUserIds },
                createdAt: { $gte: startDate, $lte: endDate }
            });
        });
    }
    getSubordinates(id, roleType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (roleType === "frontline") {
                return [id];
            }
            const fq = [
                { $match: { _id: id } },
                {
                    $graphLookup: {
                        from: "users",
                        startWith: "$manages",
                        connectFromField: "manages",
                        connectToField: "_id",
                        as: "subordinates",
                    },
                },
                {
                    $project: {
                        subordinates: "$subordinates._id",
                        roleType: "$roleType",
                        hierarchyWeight: 1,
                    },
                },
            ];
            const result = yield this.userModel.aggregate(fq);
            return [id, ...result[0].subordinates];
        });
    }
};
AgentService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("AdminAction")),
    __param(1, mongoose_1.InjectModel("VisitTrack")),
    __param(2, mongoose_1.InjectModel("User")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AgentService);
exports.AgentService = AgentService;
//# sourceMappingURL=agent.service.js.map