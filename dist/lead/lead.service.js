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
var LeadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lodash_1 = require("lodash");
const mongoose_3 = require("mongoose");
const notification_service_1 = require("../utils/notification.service");
const rules_service_1 = require("../rules/rules.service");
const user_service_1 = require("../user/user.service");
const bull_1 = require("@nestjs/bull");
const config_1 = require("../config");
const role_type_enum_1 = require("../shared/role-type.enum");
const fetch_next_lead_dto_1 = require("./dto/fetch-next-lead.dto");
const moment = require("moment");
let LeadService = LeadService_1 = class LeadService {
    constructor(leadModel, adminActionModel, campaignConfigModel, campaignModel, emailTemplateModel, leadHistoryModel, geoLocationModel, alarmModel, leadUploadQueue, ruleService, userService, notificationService) {
        this.leadModel = leadModel;
        this.adminActionModel = adminActionModel;
        this.campaignConfigModel = campaignConfigModel;
        this.campaignModel = campaignModel;
        this.emailTemplateModel = emailTemplateModel;
        this.leadHistoryModel = leadHistoryModel;
        this.geoLocationModel = geoLocationModel;
        this.alarmModel = alarmModel;
        this.leadUploadQueue = leadUploadQueue;
        this.ruleService = ruleService;
        this.userService = userService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger("leadService", true);
    }
    saveEmailAttachments(files) {
        return files;
    }
    reassignBulkLead(user, newUserEmail, leadIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.leadModel.updateMany({ _id: { $in: leadIds } }, { email: newUserEmail });
        });
    }
    reassignLead(activeUserEmail, oldUserEmail, newUserEmail, lead) {
        return __awaiter(this, void 0, void 0, function* () {
            const assigned = oldUserEmail ? "reassigned" : "assigned";
            let notes = "";
            if (oldUserEmail) {
                notes = `Lead ${assigned} from ${oldUserEmail} to ${newUserEmail} by ${activeUserEmail}`;
            }
            else {
                notes = `Lead ${assigned} to ${newUserEmail} by ${activeUserEmail}`;
            }
            const history = {
                oldUser: oldUserEmail,
                newUser: newUserEmail,
                notes,
                lead: lead._id,
                campaign: lead.campaignId,
                campaignName: lead.campaign,
                organization: lead.organization,
                geoLocation: {
                    coordinates: null
                }
            };
            const result = yield this.leadModel
                .updateOne({ _id: lead._id }, { email: newUserEmail })
                .lean()
                .exec();
            const leadHistory = yield this.leadHistoryModel.create(history);
            return { result, leadHistory };
        });
    }
    createEmailTemplate(userEmail, content, subject, campaign, attachments, organization, templateName) {
        return __awaiter(this, void 0, void 0, function* () {
            let acceptableAttachmentFormat = attachments.map((a) => {
                let { key: fileName, Location: filePath } = a, others = __rest(a, ["key", "Location"]);
                return Object.assign({ fileName,
                    filePath }, others);
            });
            const emailTemplate = new this.emailTemplateModel({
                campaign: campaign,
                email: userEmail,
                content: content,
                subject: subject,
                attachments: acceptableAttachmentFormat,
                organization,
                templateName,
            });
            return emailTemplate.save();
        });
    }
    getAllEmailTemplates(limit, skip, campaign, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emailTemplateModel
                .find({ campaign, organization })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();
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
    findAll(page, perPage, sortBy = "createdAt", showCols, searchTerm, filters, activeUserEmail, roleType, organization, typeDict, campaignId) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const limit = Number(perPage);
            const skip = Number((+page - 1) * limit);
            const { assigned, selectedCampaign, dateRange, leadStatusKeys, showArchived, showClosed, handlers } = filters, otherFilters = __rest(filters, ["assigned", "selectedCampaign", "dateRange", "leadStatusKeys", "showArchived", "showClosed", "handlers"]);
            const [startDate, endDate] = dateRange || [];
            const leadAgg = this.leadModel.aggregate();
            if (searchTerm) {
                leadAgg.match({ $text: { $search: searchTerm } });
            }
            const matchQuery = { organization, archived: { $ne: true } };
            if (showArchived) {
                matchQuery.archived["$eq"] = true;
            }
            if (showClosed) {
                matchQuery['nextAction'] = '__closed__';
            }
            if (handlers) {
                matchQuery["email"] = { $in: handlers };
            }
            if (campaignId !== 'all') {
                matchQuery['campaignId'] = mongoose_3.Types.ObjectId(campaignId);
            }
            else {
                matchQuery['campaignId'] = { $exists: true };
            }
            if ((leadStatusKeys === null || leadStatusKeys === void 0 ? void 0 : leadStatusKeys.length) > 0) {
                matchQuery["leadStatusKeys"] = { $in: leadStatusKeys };
            }
            Object.keys(otherFilters).forEach((k) => {
                if (!otherFilters[k]) {
                    delete otherFilters[k];
                }
            });
            Object.keys(otherFilters).forEach((key) => {
                switch (typeDict[key].type) {
                    case "string":
                    case "select":
                    case "tel":
                        const expr = new RegExp(otherFilters[key]);
                        matchQuery[key] = { $regex: expr, $options: "i" };
                        break;
                    case "date":
                        const dateInput = otherFilters[key];
                        if (dateInput.length === 2) {
                            const startDate = new Date(dateInput[0]);
                            const endDate = new Date(dateInput[1]);
                            matchQuery[key] = { $gte: startDate, $lt: endDate };
                        }
                        else if (dateInput.length === 1) {
                            matchQuery[key] = { $eq: new Date(dateInput[0]) };
                        }
                        break;
                }
            });
            leadAgg.match(matchQuery);
            if (assigned) {
                const subordinateEmails = yield this.userService.getSubordinates(activeUserEmail, roleType, organization);
                leadAgg.match({
                    $or: [
                        { email: { $in: [...subordinateEmails, activeUserEmail] } },
                        { email: { $exists: false } },
                    ],
                });
            }
            if (startDate) {
                leadAgg.match({
                    createdAt: { $gt: new Date(startDate) },
                });
            }
            if (endDate) {
                leadAgg.match({
                    createdAt: { $lt: new Date(endDate) },
                });
            }
            if (selectedCampaign) {
                const campaign = yield this.campaignModel
                    .findOne({ _id: selectedCampaign }, { campaignName: 1 })
                    .lean()
                    .exec();
                leadAgg.match({ campaign: campaign.campaignName });
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
            flds.push('campaignId');
            flds.forEach((fld) => {
                projectQ[fld] = 1;
            });
            projectQ.transactionCount = 1;
            if (Object.keys(projectQ).length > 0) {
                leadAgg.project(projectQ);
            }
            leadAgg.sort({ [sortBy]: 1 });
            leadAgg.facet({
                metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
                data: [{ $skip: skip }, { $limit: limit }],
            });
            const response = yield leadAgg.exec();
            return {
                total: (_b = (_a = response[0]) === null || _a === void 0 ? void 0 : _a.metadata[0]) === null || _b === void 0 ? void 0 : _b.total,
                page: (_d = (_c = response[0]) === null || _c === void 0 ? void 0 : _c.metadata[0]) === null || _d === void 0 ? void 0 : _d.page,
                data: (_e = response[0]) === null || _e === void 0 ? void 0 : _e.data,
            };
        });
    }
    getLeadColumns(campaignId, removeFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = {};
            const paths = yield this.campaignConfigModel.find({ campaignId, internalField: { $nin: removeFields } });
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
    findOneById(leadId, email, roleType) {
        return __awaiter(this, void 0, void 0, function* () {
            const lead = yield this.leadModel
                .findById(leadId)
                .lean()
                .exec();
            if (!lead.email && roleType !== role_type_enum_1.RoleType.frontline) {
                yield this.leadModel.findOneAndUpdate({ _id: leadId }, { email }, { timestamps: false }).lean().exec();
                lead.email = email;
            }
            let leadHistory = [];
            if (lead) {
                leadHistory = yield this.leadHistoryModel
                    .find({ lead: lead._id }, { nextAction: 0 })
                    .limit(5)
                    .lean()
                    .exec();
            }
            return { lead: LeadService_1.postProcessLead(lead), leadHistory };
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
    createLead(body, email, organization, campaignId, campaignName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contact, lead } = body;
            lead.email = email;
            lead.firstName = lead.firstName || 'Undefined';
            if (!lead.fullName) {
                lead.fullName = `${lead.firstName} ${lead.lastName}`;
            }
            return this.leadModel.create(Object.assign(Object.assign({}, lead), { campaignId, campaign: campaignName, organization,
                contact, isPristine: true })).catch((e) => {
                if (e.code === 11000) {
                    throw new common_1.ConflictException("Mobile number must be unique");
                }
            });
        });
    }
    deleteOne(leadId, activeUserEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.leadModel.remove({ _id: leadId }).lean().exec();
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
                this.notificationService.sendMail({ subject, text, attachments, to: sepEmails });
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
    uploadMultipleLeadFiles(files, campaignName, uploader, organization, userId, pushtoken, campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.Logger.debug("Sending file to worker for processing");
            const result = yield this.leadUploadQueue.add({ files, campaignName, uploader, organization, userId, pushtoken, campaignId });
            common_1.Logger.debug(result);
            return result;
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
    updateLead({ organization, leadId, lead, geoLocation, handlerEmail, handlerName, emailForm, requestedInformation, campaignId, callRecord, reassignToUser, }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let obj = {};
            const keysToUpdate = Object.keys(lead);
            if (keysToUpdate.length > 40) {
                throw new common_1.PreconditionFailedException(null, "Cannot have more than 40 fields in the lead schema");
            }
            keysToUpdate.forEach((key) => {
                if (!!lead[key]) {
                    obj[key] = lead[key];
                }
            });
            const oldLead = yield this.leadModel
                .findOne({ _id: leadId, organization })
                .lean()
                .exec();
            const nextEntryInHistory = {
                geoLocation: {},
            };
            nextEntryInHistory.lead = leadId;
            const [prevHistory] = yield this.leadHistoryModel
                .find({})
                .sort({ $natural: -1 })
                .limit(1);
            if (!reassignToUser) {
                nextEntryInHistory.oldUser = handlerEmail;
                nextEntryInHistory.newUser = handlerEmail;
            }
            if (((_a = lead.documentLinks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                nextEntryInHistory.documentLinks = lead.documentLinks;
            }
            if (reassignToUser && (prevHistory === null || prevHistory === void 0 ? void 0 : prevHistory.newUser) !== reassignToUser) {
                nextEntryInHistory.notes = `Lead has been assigned to ${reassignToUser} by ${handlerName}`;
                nextEntryInHistory.oldUser = prevHistory.newUser;
                nextEntryInHistory.newUser = reassignToUser;
            }
            if (lead.leadStatus !== oldLead.leadStatus) {
                nextEntryInHistory.notes = `${oldLead.leadStatus} to ${lead.leadStatus} by ${handlerName}`;
            }
            if (lead.notes) {
                nextEntryInHistory.notes = (nextEntryInHistory.notes || '') + `\n User Note: ${lead.notes}`;
            }
            nextEntryInHistory.geoLocation = geoLocation;
            if (requestedInformation && Object.keys(requestedInformation).length > 0) {
                nextEntryInHistory["requestedInformation"] = requestedInformation.filter((ri) => Object.keys(ri).length > 0);
            }
            nextEntryInHistory.prospectName = `${lead.firstName} ${lead.lastName}`;
            nextEntryInHistory.leadStatus = lead.leadStatus;
            nextEntryInHistory.followUp = (_b = lead.followUp) === null || _b === void 0 ? void 0 : _b.toString();
            nextEntryInHistory.organization = organization;
            nextEntryInHistory.campaign = campaignId;
            nextEntryInHistory.nextAction = lead.nextAction;
            let { contact, transactionCount } = obj, filteredObj = __rest(obj, ["contact", "transactionCount"]);
            if (reassignToUser) {
                obj.email = reassignToUser;
            }
            yield this.ruleService.applyRules(campaignId, oldLead, lead, nextEntryInHistory);
            filteredObj.isPristine = false;
            let result = {};
            try {
                if (!lead.nextAction) {
                    filteredObj.nextAction = '__closed__';
                }
                if (!filteredObj.followUp) {
                    filteredObj.followUp = null;
                }
                result = yield this.leadModel.findOneAndUpdate({ _id: leadId, organization }, { $inc: { transactionCount: 1 }, $set: filteredObj }, { new: true }).lean().exec();
            }
            catch (e) {
                if (e.code === 11000) {
                    throw new common_1.ConflictException("Mobile number must be unique");
                }
            }
            yield this.leadHistoryModel.create(Object.assign(Object.assign({}, nextEntryInHistory), callRecord));
            if (!lodash_1.values(emailForm).every(lodash_1.isEmpty)) {
                const { subject, attachments, content, overwriteEmail } = emailForm;
                this.sendEmailToLead({
                    content,
                    subject,
                    attachments,
                    email: overwriteEmail || lead.email,
                });
            }
            return result;
        });
    }
    sendEmailToLead({ content, subject, attachments, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.notificationService.sendMail({
                from: '"Company" <' + config_1.default.mail.user + ">",
                to: ["shanur.cse.nitap@gmail.com"],
                subject: subject,
                text: content,
                replyTo: {
                    name: "shanur",
                    address: "mnsh0203@gmail.com",
                },
                attachments: attachments === null || attachments === void 0 ? void 0 : attachments.map((a) => {
                    return {
                        filename: a.fileName,
                        path: a.filePath,
                    };
                }),
            });
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
    findInjectableLeads(organization, email, campaignId, projection) {
        return __awaiter(this, void 0, void 0, function* () {
            const fifteenMinsAgo = moment().subtract(15, 'minutes').toDate();
            const now = moment().toDate();
            const lead = yield this.leadModel
                .findOne({ campaignId, organization, email, followUp: { $lte: now, $gte: fifteenMinsAgo } })
                .lean()
                .exec();
            this.logger.debug({ injectableLead: lead });
            return lead;
        });
    }
    static postProcessLead(lead) {
        lead.notes = "";
        lead.nextAction = null;
        lead.followUp = null;
        return lead;
    }
    fetchNextLead({ campaignId, filters, email, organization, typeDict, roleType, nonKeyFilters }) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.keys(filters).forEach((k) => {
                if (!filters[k]) {
                    delete filters[k];
                }
            });
            const campaign = yield this.campaignModel
                .findOne({ _id: campaignId, organization })
                .lean()
                .exec();
            if (!campaign || !campaign.browsableCols || !campaign.editableCols) {
                throw new common_1.UnprocessableEntityException();
            }
            let projection = {
                documentLinks: 1
            };
            campaign.browsableCols.forEach((c) => {
                projection[c] = 1;
            });
            projection["contact"] = 1;
            projection["email"] = 1;
            const injectableLead = yield this.findInjectableLeads(organization, email, campaign._id, projection);
            if (injectableLead) {
                this.logger.log("Injectable lead found, returning it");
                const leadHistory = yield this.leadHistoryModel
                    .find({ lead: injectableLead._id })
                    .limit(5)
                    .lean()
                    .exec();
                return { lead: LeadService_1.postProcessLead(injectableLead), leadHistory, isInjectableLead: true };
            }
            const singleLeadAgg = this.leadModel.aggregate();
            singleLeadAgg.match({ campaignId: campaign._id });
            const subordinateEmails = yield this.userService.getSubordinates(email, roleType, organization);
            singleLeadAgg.match({
                $or: [
                    { email: { $in: [...subordinateEmails, email] } },
                    { email: { $exists: false } },
                    { archived: false }
                ],
            });
            if (nonKeyFilters) {
                var todayStart = new Date();
                todayStart.setHours(0);
                todayStart.setMinutes(0);
                todayStart.setSeconds(1);
                var todayEnd = new Date();
                todayEnd.setHours(23);
                todayEnd.setMinutes(59);
                todayEnd.setSeconds(59);
                switch (nonKeyFilters.typeOfLead) {
                    case fetch_next_lead_dto_1.TypeOfLead.followUp: {
                        singleLeadAgg.match({
                            followUp: {
                                $gte: new Date(todayStart),
                                $lte: new Date(todayEnd),
                            },
                        });
                        break;
                    }
                    case fetch_next_lead_dto_1.TypeOfLead.fresh: {
                        singleLeadAgg.match({ isPristine: true });
                        break;
                    }
                    case fetch_next_lead_dto_1.TypeOfLead.freshAndFollowUp: {
                        break;
                    }
                }
            }
            Object.keys(filters).forEach((key) => {
                switch (typeDict[key].type) {
                    case "string":
                    case "select":
                    case "tel":
                        const expr = new RegExp(filters[key]);
                        singleLeadAgg.match({ [key]: { $regex: expr, $options: "i" } });
                        break;
                    case "date":
                        const dateInput = filters[key];
                        if (dateInput.length === 2) {
                            const startDate = new Date(dateInput[0]);
                            const endDate = new Date(dateInput[1]);
                            singleLeadAgg.match({
                                [key]: {
                                    $gte: startDate,
                                    $lt: endDate,
                                },
                            });
                        }
                        else if (dateInput.length === 1) {
                            singleLeadAgg.match({
                                [key]: {
                                    $eq: new Date(dateInput[0]),
                                },
                            });
                        }
                        break;
                }
            });
            singleLeadAgg.sort({ updatedAt: 1 });
            singleLeadAgg.limit(1);
            singleLeadAgg.project(projection);
            const lead = (yield singleLeadAgg.exec())[0];
            let leadHistory = [];
            if (lead) {
                leadHistory = yield this.leadHistoryModel
                    .find({ lead: lead._id })
                    .limit(5);
            }
            if (!lead.email && roleType === role_type_enum_1.RoleType.frontline) {
                lead.email = email;
                yield this.leadModel.findOneAndUpdate({ _id: lead._id }, { email }, { timestamps: false });
                this.logger.debug(`Assigned lead ${lead._id} to ${email}`);
            }
            return { lead: LeadService_1.postProcessLead(lead), leadHistory, isInjectableLead: false };
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
    getTransactions(organization, email, roleType, payload, isStreamable) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            let conditionalQueries = {};
            if (((_b = (_a = payload.filters) === null || _a === void 0 ? void 0 : _a.handler) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                conditionalQueries["newUser"] = { $in: payload.filters.handler };
            }
            ;
            if ((_c = payload.filters) === null || _c === void 0 ? void 0 : _c.leadId) {
                conditionalQueries['lead'] = payload.filters.leadId;
            }
            if ((_d = payload.filters) === null || _d === void 0 ? void 0 : _d.prospectName) {
                const expr = new RegExp(payload.filters.prospectName);
                conditionalQueries['prospectName'] = { $regex: expr, $options: "i" };
            }
            if ((_e = payload.filters) === null || _e === void 0 ? void 0 : _e.campaign) {
                conditionalQueries["campaign"] = payload.filters.campaign;
            }
            if ((_f = payload.filters) === null || _f === void 0 ? void 0 : _f.startDate) {
                conditionalQueries["createdAt"] = {};
                conditionalQueries["createdAt"]["$gte"] = new Date(payload.filters.startDate);
            }
            if ((_g = payload.filters) === null || _g === void 0 ? void 0 : _g.endDate) {
                conditionalQueries["createdAt"]["$lte"] = new Date(payload.filters.endDate);
            }
            const sortOrder = payload.pagination.sortOrder === "ASC" ? 1 : -1;
            const query = Object.assign({ organization }, conditionalQueries);
            const result = this.leadHistoryModel
                .find(query)
                .sort({ [payload.pagination.sortBy]: sortOrder });
            let count = 0;
            if (!isStreamable) {
                result.limit(payload.pagination.perPage).skip((payload.pagination.page - 1) * payload.pagination.perPage);
                count = yield this.leadHistoryModel.countDocuments(query);
            }
            const response = yield result.lean().exec();
            return { response, total: count };
        });
    }
    getFollowUps({ interval, organization, email, campaignId, limit, skip, page, }) {
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
            if (campaignId) {
                leadAgg.match({ campaignId: mongoose_3.Types.ObjectId(campaignId) });
            }
            if ((interval === null || interval === void 0 ? void 0 : interval.length) === 2) {
                leadAgg.match({
                    followUp: {
                        $gte: new Date(interval[0]),
                        $lte: new Date(interval[1]),
                    },
                });
            }
            else {
                leadAgg.match({
                    followUp: {
                        $gte: todayStart,
                    },
                });
            }
            leadAgg.match({ organization, email });
            leadAgg.sort({ followUp: 1 });
            leadAgg.facet({
                metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
                data: [{ $skip: skip }, { $limit: limit }],
            });
            return leadAgg.exec();
        });
    }
    checkPrecondition(user, subordinateEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const subordinates = yield this.userService.getSubordinates(user.email, user.roleType, user.organization);
            if (!subordinates.indexOf(subordinateEmail) && user.roleType !== "admin") {
                throw new common_1.PreconditionFailedException(null, "You do not manage the user whose followups you want to see");
            }
        });
    }
    getAllAlarms(body, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, perPage = 20, filters = {}, sortBy = "createdAt" } = body;
            const limit = Number(perPage);
            const skip = Number((page - 1) * limit);
            const fq = [
                { $match: { organization } },
                { $sort: { [sortBy]: 1 } },
                { $skip: skip },
                { $limit: limit },
            ];
            return this.alarmModel.aggregate(fq).exec();
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
    addContact(contact, leadId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.leadModel.findByIdAndUpdate(leadId, {
                $push: { contact },
            });
        });
    }
    archiveLead(leadId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.leadModel.findOneAndUpdate({ _id: leadId }, { $set: { archived: true } });
        });
    }
    archiveLeads(leadIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.leadModel.updateMany({ _id: { $in: leadIds } }, { $set: { archived: true } });
        });
    }
    unarchiveLeads(leadIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.leadModel.updateMany({ _id: { $in: leadIds } }, { $set: { archived: false } });
        });
    }
    transferLeads(leadIds, toCampaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { campaignName, _id } = yield this.campaignModel.findOne({ _id: toCampaignId }, { campaignName: 1 }).lean().exec();
            return this.leadModel.updateMany({ _id: { $in: leadIds } }, { $set: { campaignId: _id, campaign: campaignName } }).lean().exec();
        });
    }
    openClosedLeads(leadIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.leadModel.updateMany({ _id: { $in: leadIds } }, { $set: { nextAction: '__open__' } });
        });
    }
};
LeadService = LeadService_1 = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("Lead")),
    __param(1, mongoose_1.InjectModel("AdminAction")),
    __param(2, mongoose_1.InjectModel("CampaignConfig")),
    __param(3, mongoose_1.InjectModel("Campaign")),
    __param(4, mongoose_1.InjectModel("EmailTemplate")),
    __param(5, mongoose_1.InjectModel("LeadHistory")),
    __param(6, mongoose_1.InjectModel("GeoLocation")),
    __param(7, mongoose_1.InjectModel("Alarm")),
    __param(8, bull_1.InjectQueue('leadQ')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model, Object, rules_service_1.RulesService,
        user_service_1.UserService,
        notification_service_1.NotificationService])
], LeadService);
exports.LeadService = LeadService;
//# sourceMappingURL=lead.service.js.map