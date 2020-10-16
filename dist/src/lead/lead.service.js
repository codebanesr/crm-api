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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lodash_1 = require("lodash");
const mongoose_3 = require("mongoose");
const sendMail_1 = require("../utils/sendMail");
const parseExcel_1 = require("../utils/parseExcel");
const xlsx_1 = require("xlsx");
const follow_up_dto_1 = require("./dto/follow-up.dto");
let LeadService = class LeadService {
    constructor(leadModel, userModel, campaignConfigModel, campaignModel, emailTemplateModel, callLogModel, geoLocationModel, alarmModel) {
        this.leadModel = leadModel;
        this.userModel = userModel;
        this.campaignConfigModel = campaignConfigModel;
        this.campaignModel = campaignModel;
        this.emailTemplateModel = emailTemplateModel;
        this.callLogModel = callLogModel;
        this.geoLocationModel = geoLocationModel;
        this.alarmModel = alarmModel;
    }
    saveEmailAttachments(files) {
        return files;
    }
    reassignLead(activeUserEmail, oldUserEmail, newUserEmail, lead) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const assigned = oldUserEmail ? "reassigned" : "assigned";
                let note = "";
                if (oldUserEmail) {
                    note = `Lead ${assigned} from ${oldUserEmail} to ${newUserEmail} by ${activeUserEmail}`;
                }
                else {
                    note = `Lead ${assigned} to ${newUserEmail} by ${activeUserEmail}`;
                }
                const history = {
                    oldUser: oldUserEmail,
                    newUser: newUserEmail,
                    note,
                };
                const result = yield this.leadModel
                    .updateOne({ externalId: lead.externalId }, { email: newUserEmail, $push: { history: history } })
                    .lean()
                    .exec();
                return result;
            }
            catch (e) {
                return e.message;
            }
        });
    }
    createEmailTemplate(userEmail, content, subject, campaign, attachments, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            let acceptableAttachmentFormat = attachments.map((a) => {
                let { originalname: fileName, path: filePath } = a, others = __rest(a, ["originalname", "path"]);
                return Object.assign({ fileName,
                    filePath }, others);
            });
            const emailTemplate = new this.emailTemplateModel({
                campaign: campaign,
                email: userEmail,
                content: content,
                subject: subject,
                attachments: acceptableAttachmentFormat,
                organization
            });
            return emailTemplate.save();
        });
    }
    getAllEmailTemplates(limit, skip, searchTerm, organization, campaignName) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.emailTemplateModel.aggregate();
            const matchQ = { subject: { $regex: `^${searchTerm}`, $options: "I" }, organization };
            if (campaignName !== "undefined") {
                matchQ["campaign"] = campaignName;
            }
            const result = yield query
                .match(matchQ)
                .sort("type")
                .limit(+limit)
                .skip(+skip)
                .exec();
            return result;
        });
    }
    getLeadHistoryById(externalId, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const history = yield this.leadModel.findOne({ externalId: externalId, organization }, { history: 1, externalId });
            return history;
        });
    }
    getLeadReassignmentHistory(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const leadId = email;
            try {
                const result = yield this.leadModel.aggregate([
                    { $match: { _id: leadId } },
                    { $project: { history: 1 } },
                    { $unwind: "$history" },
                    { $sort: { time: 1 } },
                    { $limit: 5 },
                    { $replaceRoot: { newRoot: "$history" } },
                ]);
                return result;
            }
            catch (e) {
                common_1.Logger.error("An error occured in getLeadReassignmentHistory");
                return e.message;
            }
        });
    }
    getBasicOverview() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.leadModel.aggregate([
                { $group: { _id: "$leadStatus", count: { $sum: 1 } } },
            ]);
            const total = yield this.leadModel.count({});
            return { result, total };
        });
    }
    findAll(page, perPage, sortBy = "createdAt", showCols, searchTerm, filters, activeUserEmail, roleType, organization) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const limit = Number(perPage);
            const skip = Number((+page - 1) * limit);
            const { assigned, selectedCampaign, dateRange } = filters;
            const [startDate, endDate] = dateRange || [];
            const matchQ = { $and: [{ organization }] };
            if (assigned) {
                const subordinateEmails = yield this.getSubordinates(activeUserEmail, roleType);
                matchQ.$and.push({
                    email: { $in: [...subordinateEmails, activeUserEmail] },
                });
            }
            else {
                matchQ.$and.push({ email: { $exists: false } });
            }
            if (startDate) {
                matchQ.$and.push({
                    createdAt: { $gt: new Date(startDate) },
                });
            }
            if (endDate) {
                matchQ.$and.push({
                    createdAt: { $lt: new Date(endDate) },
                });
            }
            if (selectedCampaign) {
                matchQ["$and"].push({ campaign: selectedCampaign });
            }
            if (searchTerm) {
                matchQ["$and"].push({ $text: { $search: searchTerm } });
            }
            let flds;
            if (showCols && showCols.length > 0) {
                flds = showCols;
            }
            else {
                flds = (yield this.campaignConfigModel
                    .find({ name: "core", checked: true }, { internalField: 1 })
                    .lean()
                    .exec()).map((config) => config.internalField);
            }
            const projectQ = {};
            flds.forEach((fld) => {
                projectQ[fld] = { $ifNull: [`$${fld}`, "---"] };
            });
            projectQ._id = 0;
            const fq = [
                { $match: matchQ },
                {
                    $project: projectQ,
                },
                { $sort: { [sortBy]: 1 } },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            { $addFields: { page: Number(page) } },
                        ],
                        data: [{ $skip: skip }, { $limit: limit }],
                    },
                },
            ];
            const response = yield this.leadModel.aggregate(fq);
            return {
                total: (_b = (_a = response[0]) === null || _a === void 0 ? void 0 : _a.metadata[0]) === null || _b === void 0 ? void 0 : _b.total,
                page: (_d = (_c = response[0]) === null || _c === void 0 ? void 0 : _c.metadata[0]) === null || _d === void 0 ? void 0 : _d.page,
                data: (_e = response[0]) === null || _e === void 0 ? void 0 : _e.data,
            };
        });
    }
    getLeadColumns(campaignType = "core", organization) {
        return __awaiter(this, void 0, void 0, function* () {
            if (campaignType !== "core") {
                const campaign = yield this.campaignModel
                    .findOne({ _id: mongoose_3.Types.ObjectId(campaignType), organization })
                    .lean()
                    .exec();
                campaignType = campaign.campaignName;
            }
            const matchQ = { name: campaignType };
            const paths = yield this.campaignConfigModel.aggregate([
                { $match: matchQ },
            ]);
            return { paths: paths };
        });
    }
    insertOne(body, activeUserEmail, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            body.email = activeUserEmail;
            body.organization = organization;
            const lead = new this.leadModel(body);
            const result = yield lead.save();
            yield this.createAlarm({
                module: "LEAD",
                tag: "LEAD_CREATE",
                severity: "LOW",
                userEmail: activeUserEmail,
                moduleId: result._id,
            });
            return result;
        });
    }
    findOneById(leadId, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const lead = yield this.leadModel
                .findOne({ externalId: leadId, organization })
                .lean()
                .exec();
            return lead;
        });
    }
    patch(productId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateOps = {};
            for (const ops of body) {
                const propName = ops.propName;
                updateOps[propName] = ops.value;
            }
            return this.leadModel
                .update({ _id: productId }, { $set: updateOps })
                .exec();
        });
    }
    deleteOne(leadId, activeUserEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.leadModel
                .remove({ _id: leadId })
                .lean()
                .exec();
            yield this.createAlarm({
                module: "LEAD",
                tag: "LEAD_CREATE",
                severity: "LOW",
                userEmail: activeUserEmail,
                moduleId: leadId,
            });
            return result;
        });
    }
    createAlarm(alarmObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const alarm = new this.alarmModel(alarmObj);
            const result = yield alarm.save();
            return result;
        });
    }
    sendBulkEmails(emails, subject, text, attachments, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            emails = lodash_1.isArray(emails) ? emails : [emails];
            const sepEmails = emails.join(",");
            try {
                sendMail_1.sendEmail(sepEmails, subject, text, attachments);
                return { success: true };
            }
            catch (e) {
                common_1.Logger.error("Some error occured while sending bulk emails in sendBulkEmails", e.message);
                return { error: e.message };
            }
        });
    }
    suggestLeads(activeUserEmail, leadId, organization, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.leadModel.aggregate();
            query.match({
                organization,
                externalId: { $regex: `^${leadId}` },
                email: activeUserEmail,
            });
            query.project("externalId -_id");
            query.limit(Number(limit));
            let result = yield query.exec();
            return result;
        });
    }
    uploadMultipleLeadFiles(files, campaignName, uploader, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const ccnfg = (yield this.campaignConfigModel
                .find({ name: campaignName, organization }, { readableField: 1, internalField: 1, _id: 0 })
                .lean()
                .exec());
            if (!ccnfg) {
                return {
                    error: `Campaign with name ${campaignName} not found, create a campaign before uploading leads for that campaign`,
                };
            }
            const result = yield this.parseLeadFiles(files, ccnfg, campaignName, organization, uploader);
            return { files, result };
        });
    }
    syncPhoneCalls(callLogs, organization, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transformed = callLogs.map(callLog => {
                    return Object.assign(Object.assign({}, callLog), { organization, user });
                });
                return this.callLogModel.insertMany(transformed);
            }
            catch (e) {
                common_1.Logger.error("An error occured while syncing phone calls in leadService.ts", e.message);
                return e.message;
            }
        });
    }
    addGeolocation(activeUserId, lat, lng, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            var geoObj = new this.geoLocationModel({
                userid: mongoose_3.Types.ObjectId(activeUserId),
                location: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
            });
            const result = yield geoObj.save();
            return result;
        });
    }
    getPerformance() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateLead(externalId, lead) {
        return __awaiter(this, void 0, void 0, function* () {
            let obj = {};
            Object.keys(lead).forEach((key) => {
                if (!!lead[key]) {
                    obj[key] = lead[key];
                }
            });
            const result = yield this.leadModel.findOneAndUpdate({ externalId: externalId }, { $set: obj });
            return result;
        });
    }
    saveLeads(leads, campaignName, originalFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = [];
            const updated = [];
            const error = [];
            for (const l of leads) {
                const { lastErrorObject, value } = yield this.leadModel
                    .findOneAndUpdate({ externalId: l.externalId }, Object.assign(Object.assign({}, l), { campaign: campaignName }), { new: true, upsert: true, rawResult: true })
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
            xlsx_1.writeFile(wb, originalFileName + "_system");
            console.log("created: ", created.length, "updated: ", updated.length, "error:", error.length);
        });
    }
    getSubordinates(email, roleType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (roleType !== "manager" && roleType !== "seniorManager") {
                return [email];
            }
            const fq = [
                { $match: { email: email } },
                {
                    $graphLookup: {
                        from: "users",
                        startWith: "$manages",
                        connectFromField: "manages",
                        connectToField: "email",
                        as: "subordinates",
                    },
                },
                {
                    $project: {
                        subordinates: "$subordinates.email",
                        roleType: "$roleType",
                        hierarchyWeight: 1,
                    },
                },
            ];
            const result = yield this.userModel.aggregate(fq);
            return result[0].subordinates;
        });
    }
    parseLeadFiles(files, ccnfg, campaignName, organization, uploader) {
        return __awaiter(this, void 0, void 0, function* () {
            files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                const jsonRes = parseExcel_1.default(file.path, ccnfg);
                this.saveLeadsFromExcel(jsonRes, campaignName, file.originalname, organization, uploader);
            }));
        });
    }
    saveLeadsFromExcel(leads, campaignName, originalFileName, organization, uploader) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = [];
            const updated = [];
            const error = [];
            for (const l of leads) {
                const { lastErrorObject, value } = yield this.leadModel
                    .findOneAndUpdate({ externalId: l.externalId }, Object.assign(Object.assign({}, l), { campaign: campaignName, organization, uploader }), { new: true, upsert: true, rawResult: true })
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
            xlsx_1.writeFile(wb, originalFileName + "_system");
            console.log("created: ", created.length, "updated: ", updated.length, "error:", error.length);
        });
    }
    leadActivityByUser(startDate, endDate, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedAtQuery = this.getUpdatedAtQuery(startDate, endDate);
            const qb = this.leadModel.aggregate();
            qb.match(Object.assign({ email }, updatedAtQuery));
            qb.group({
                _id: { leadStatus: "$leadStatus" },
                myCount: { $sum: 1 },
            });
            return qb.exec();
        });
    }
    getUpdatedAtQuery(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const uq = { updatedAt: { $gt: new Date("1000-01-01T00:00:00.000Z") } };
            if (startDate) {
                uq.updatedAt["$gt"] = new Date(startDate);
            }
            if (endDate) {
                uq.updatedAt["$lt"] = new Date(endDate);
            }
            return uq;
        });
    }
    fetchNextLead(campaignId, leadStatus, email, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const campaign = yield this.campaignModel
                .findOne({ _id: campaignId, organization })
                .lean()
                .exec();
            const result = yield this.leadModel
                .findOne({
                campaign: campaign.campaignName,
                leadStatus,
                $or: [
                    { email: email },
                    {
                        email: { $exists: false },
                    },
                ],
            })
                .sort({ _id: -1 })
                .lean()
                .exec();
            return { result };
        });
    }
    getSaleAmountByLeadStatus(campaignName) {
        const qb = this.leadModel.aggregate();
        if (campaignName) {
            qb.match({ campaign: campaignName });
        }
        qb.group({
            _id: "$leadStatus",
            totalSaleAmount: {
                $sum: "$amount",
            },
        });
        return qb.exec();
    }
    getFollowUps(duration, organization, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const leadAgg = this.leadModel.aggregate();
            var todayStart = new Date();
            todayStart.setHours(0);
            todayStart.setMinutes(0);
            todayStart.setSeconds(1);
            var todayEnd = new Date();
            todayEnd.setHours(23);
            todayEnd.setMinutes(59);
            todayEnd.setSeconds(59);
            if (duration === follow_up_dto_1.INTERVAL.TODAY) {
                leadAgg.match({
                    'followUp': {
                        '$lte': todayEnd,
                        '$gte': todayStart
                    }
                });
            }
            else if (duration === follow_up_dto_1.INTERVAL.THIS_WEEK) {
                const lastDateOfWeek = new Date(todayStart.setDate(todayStart.getDate() - todayStart.getDay() + 6));
                leadAgg.match({
                    'followUp': {
                        '$lte': lastDateOfWeek,
                        '$gte': todayStart
                    }
                });
            }
            else if (duration === follow_up_dto_1.INTERVAL.THIS_MONTH) {
                const lastDateOfMonth = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 0, 23, 59, 59);
                leadAgg.match({
                    'followUp': {
                        '$lte': lastDateOfMonth,
                        '$gte': todayStart
                    }
                });
            }
            leadAgg.match({ organization, email });
            leadAgg.sort({ followUp: 1 });
            common_1.Logger.debug(leadAgg);
            return leadAgg.exec();
        });
    }
    getAllAlarms(body, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, perPage = 20, filters = {}, sortBy = 'createdAt' } = body;
            const limit = Number(perPage);
            const skip = Number((page - 1) * limit);
            const fq = [
                { $match: { organization } },
                { $sort: { [sortBy]: 1 } },
                { $skip: skip },
                { $limit: limit }
            ];
            return yield this.alarmModel.aggregate(fq).exec();
        });
    }
    getUsersActivity(dateRange, userEmail, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            let startDate, endDate;
            const userAgg = this.leadModel.aggregate();
            userAgg.match({ email: userEmail, organization });
            if (dateRange) {
                [startDate, endDate] = dateRange;
                userAgg.match({ createdAt: { $gte: startDate, $lt: endDate } });
            }
            userAgg.project({ amount: "$amount", leadStatus: "$leadStatus" });
            userAgg.group({ _id: "$leadStatus", amount: { $sum: "$amount" } });
            return userAgg.exec();
        });
    }
};
LeadService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("Lead")),
    __param(1, mongoose_1.InjectModel("User")),
    __param(2, mongoose_1.InjectModel("CampaignConfig")),
    __param(3, mongoose_1.InjectModel("Campaign")),
    __param(4, mongoose_1.InjectModel("EmailTemplate")),
    __param(5, mongoose_1.InjectModel("CallLog")),
    __param(6, mongoose_1.InjectModel("GeoLocation")),
    __param(7, mongoose_1.InjectModel("Alarm")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], LeadService);
exports.LeadService = LeadService;
//# sourceMappingURL=lead.service.js.map