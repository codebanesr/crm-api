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
let AgentService = class AgentService {
    constructor(adminActionModel) {
        this.adminActionModel = adminActionModel;
    }
    listActions(activeUserId, organization, skip, fileType, sortBy = "handler", me) {
        return __awaiter(this, void 0, void 0, function* () {
            const fq = this.adminActionModel.aggregate();
            fq.match({ organization });
            if (me) {
                fq.match({ userid: activeUserId });
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
            return fq.exec();
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
};
AgentService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("AdminAction")),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AgentService);
exports.AgentService = AgentService;
//# sourceMappingURL=agent.service.js.map