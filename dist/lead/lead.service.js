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
const nodemailer_1 = require("nodemailer");
const config_1 = require("../config");
const upload_service_1 = require("../upload/upload.service");
const push_notification_service_1 = require("../push-notification/push-notification.service");
const rules_service_1 = require("../rules/rules.service");
const user_service_1 = require("../user/user.service");
let LeadService = class LeadService {
    constructor(leadModel, adminActionModel, campaignConfigModel, campaignModel, emailTemplateModel, leadHistoryModel, geoLocationModel, alarmModel, ruleService, s3UploadService, pushNotificationService, userService) {
        this.leadModel = leadModel;
        this.adminActionModel = adminActionModel;
        this.campaignConfigModel = campaignConfigModel;
        this.campaignModel = campaignModel;
        this.emailTemplateModel = emailTemplateModel;
        this.leadHistoryModel = leadHistoryModel;
        this.geoLocationModel = geoLocationModel;
        this.alarmModel = alarmModel;
        this.ruleService = ruleService;
        this.s3UploadService = s3UploadService;
        this.pushNotificationService = pushNotificationService;
        this.userService = userService;
    }
    saveEmailAttachments(files) {
        return files;
    }
    reassignLead(activeUserEmail, oldUserEmail, newUserEmail, lead) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                };
                const result = yield this.leadModel
                    .updateOne({ _id: lead._id }, { email: newUserEmail, $push: { history: history } })
                    .lean()
                    .exec();
                return result;
            }
            catch (e) {
                return e.message;
            }
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
            const { assigned, selectedCampaign, dateRange, leadStatusKeys } = filters, otherFilters = __rest(filters, ["assigned", "selectedCampaign", "dateRange", "leadStatusKeys"]);
            const [startDate, endDate] = dateRange || [];
            const leadAgg = this.leadModel.aggregate();
            if (searchTerm) {
                leadAgg.match({ $text: { $search: searchTerm } });
            }
            const matchQuery = { organization };
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
            flds.forEach((fld) => {
                projectQ[fld] = 1;
            });
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
    findOneById(leadId, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const lead = yield this.leadModel
                .findById(leadId)
                .lean()
                .exec();
            let leadHistory = [];
            if (lead) {
                leadHistory = yield this.leadHistoryModel
                    .find({ lead: lead._id })
                    .limit(5);
            }
            return { lead, leadHistory };
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
                contact }));
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
    uploadMultipleLeadFiles(files, campaignName, uploader, organization, userId, pushtoken, campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniqueAttr = yield this.campaignModel.findOne({ _id: campaignId }, { uniqueCols: 1 }).lean().exec();
            const ccnfg = yield this.campaignConfigModel.find({ campaignId }, { readableField: 1, internalField: 1, _id: 0 }).lean().exec();
            if (!ccnfg) {
                throw new Error(`Campaign with name ${campaignName} not found, create a campaign before uploading leads for that campaign`);
            }
            yield this.adminActionModel.create({
                userid: userId,
                organization,
                actionType: "lead",
                filePath: files[0].Location,
                savedOn: "s3",
                campaign: campaignId,
                fileType: "campaignConfig",
            });
            const result = yield this.parseLeadFiles(files, ccnfg, campaignName, organization, uploader, userId, pushtoken, campaignId, uniqueAttr);
            return { files, result };
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
    updateLead({ organization, leadId, lead, geoLocation, handlerEmail, handlerName, reassignmentInfo, emailForm, requestedInformation, campaignId, callRecord }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let obj = {};
            common_1.Logger.debug({ geoLocation, reassignmentInfo });
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
            if (!reassignmentInfo) {
                nextEntryInHistory.notes = `Lead has been assigned to ${handlerName}`;
                nextEntryInHistory.newUser = handlerEmail;
            }
            if (((_a = lead.documentLinks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                nextEntryInHistory.documentLinks = lead.documentLinks;
            }
            if (reassignmentInfo && (prevHistory === null || prevHistory === void 0 ? void 0 : prevHistory.newUser) !== reassignmentInfo.newUser) {
                nextEntryInHistory.notes = `Lead has been assigned to ${reassignmentInfo.newUser} by ${handlerName}`;
                nextEntryInHistory.oldUser = prevHistory.newUser;
                nextEntryInHistory.newUser = reassignmentInfo.newUser;
            }
            if (lead.leadStatus !== oldLead.leadStatus) {
                nextEntryInHistory.notes = `${oldLead.leadStatus} to ${lead.leadStatus} by ${handlerName}`;
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
            lead.nextAction && (nextEntryInHistory.nextAction = lead.nextAction);
            let { contact } = obj, filteredObj = __rest(obj, ["contact"]);
            if (lodash_1.get(reassignmentInfo, "newUser")) {
                obj.email = reassignmentInfo.newUser;
            }
            yield this.ruleService.applyRules(campaignId, oldLead, lead, nextEntryInHistory);
            const result = yield this.leadModel.findOneAndUpdate({ _id: leadId, organization }, { $set: filteredObj });
            yield this.leadHistoryModel.create(Object.assign(Object.assign({}, nextEntryInHistory), callRecord));
            if (!lodash_1.values(emailForm).every(lodash_1.isEmpty)) {
                const { subject, attachments, content } = emailForm;
                this.sendEmailToLead({
                    content,
                    subject,
                    attachments,
                    email: lead.email,
                });
            }
            return result;
        });
    }
    parseLeadFiles(files, ccnfg, campaignName, organization, uploader, uploaderId, pushtoken, campaignId, uniqueAttr) {
        return __awaiter(this, void 0, void 0, function* () {
            files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                const jsonRes = yield parseExcel_1.default(file.Location, ccnfg);
                yield this.saveLeadsFromExcel(jsonRes, campaignName, file.Key, organization, uploader, uploaderId, pushtoken, campaignId, uniqueAttr);
            }));
        });
    }
    saveLeadsFromExcel(leads, campaignName, originalFileName, organization, uploader, uploaderId, pushtoken, campaignId, uniqueAttr) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = [];
            const updated = [];
            const error = [];
            const leadColumns = yield this.campaignConfigModel
                .find({
                name: campaignName,
                organization,
            })
                .lean()
                .exec();
            for (const lead of leads) {
                let findUniqueLeadQuery = {};
                uniqueAttr.uniqueCols.forEach(col => {
                    findUniqueLeadQuery[col] = lead[col];
                });
                findUniqueLeadQuery["campaignId"] = campaignId;
                const { lastErrorObject, value } = yield this.leadModel
                    .findOneAndUpdate(findUniqueLeadQuery, Object.assign(Object.assign({}, lead), { campaign: campaignName, organization, uploader, campaignId }), { new: true, upsert: true, rawResult: true })
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
            const wbOut = xlsx_1.write(wb, {
                bookType: "xlsx",
                type: "buffer",
            });
            const fileName = `result-${originalFileName}`;
            const result = yield this.s3UploadService.uploadFileBuffer(fileName, wbOut);
            yield this.adminActionModel.create({
                userid: uploaderId,
                organization,
                actionType: "lead",
                filePath: result.Location,
                savedOn: "s3",
                fileType: "lead",
                campaign: campaignId
            });
            yield this.pushNotificationService.sendPushNotification(pushtoken, {
                notification: {
                    title: "File Upload Complete",
                    icon: `https://cdn3.vectorstock.com/i/1000x1000/94/72/cute-black-cat-icon-vector-13499472.jpg`,
                    body: `please visit ${result.Location} for the result`,
                    tag: "some random tag",
                    badge: `https://e7.pngegg.com/pngimages/564/873/png-clipart-computer-icons-education-molecule-icon-structure-area.png`,
                },
            });
            return result;
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
    fetchNextLead({ campaignId, filters, email, organization, typeDict, roleType }) {
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
            const singleLeadAgg = this.leadModel.aggregate();
            singleLeadAgg.match({ campaignId: campaign._id });
            const subordinateEmails = yield this.userService.getSubordinates(email, roleType, organization);
            singleLeadAgg.match({
                $or: [
                    { email: { $in: [...subordinateEmails, email] } },
                    { email: { $exists: false } },
                ],
            });
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
            let projection = {
                documentLinks: 1
            };
            campaign.browsableCols.forEach((c) => {
                projection[c] = 1;
            });
            projection["contact"] = 1;
            projection["nextAction"] = 1;
            singleLeadAgg.project(projection);
            const lead = (yield singleLeadAgg.exec())[0];
            let leadHistory = [];
            if (lead) {
                leadHistory = yield this.leadHistoryModel
                    .find({ lead: lead._id })
                    .limit(5);
            }
            return { lead, leadHistory };
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
            let subordinateEmails = yield this.userService.getSubordinates(email, roleType, organization);
            if (((_b = (_a = payload.filters) === null || _a === void 0 ? void 0 : _a.handler) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                subordinateEmails = lodash_1.intersection(payload.filters.handler, subordinateEmails, [email]);
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
            const query = Object.assign({ organization, newUser: { $in: subordinateEmails } }, conditionalQueries);
            const result = this.leadHistoryModel
                .find(query)
                .sort({ [payload.pagination.sortBy]: sortOrder });
            let count = 0;
            if (!isStreamable) {
                result.limit(payload.pagination.perPage).skip(payload.pagination.page * payload.pagination.perPage);
                count = yield this.leadHistoryModel.countDocuments(query);
            }
            const response = yield result.lean().exec();
            return { response, total: count };
        });
    }
    getFollowUps({ interval, organization, email, campaignName, limit, skip, page, }) {
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
            if (campaignName) {
                leadAgg.match({ campaign: campaignName });
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
    sendEmailToLead({ content, subject, attachments, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer_1.createTransport({
                service: "Mailgun",
                auth: {
                    user: config_1.default.mail.user,
                    pass: config_1.default.mail.pass,
                },
            });
            let mailOptions = {
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
            };
            var sended = yield new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield transporter.sendMail(mailOptions, (error, info) => __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            console.log("Message sent: %s", error);
                            return reject(false);
                        }
                        console.log("Message sent: %s", info.messageId);
                        resolve(true);
                    }));
                });
            });
            return sended;
        });
    }
    addContact(contact, leadId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.leadModel.findByIdAndUpdate(leadId, {
                $push: { contact },
            });
        });
    }
};
LeadService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("Lead")),
    __param(1, mongoose_1.InjectModel("AdminAction")),
    __param(2, mongoose_1.InjectModel("CampaignConfig")),
    __param(3, mongoose_1.InjectModel("Campaign")),
    __param(4, mongoose_1.InjectModel("EmailTemplate")),
    __param(5, mongoose_1.InjectModel("LeadHistory")),
    __param(6, mongoose_1.InjectModel("GeoLocation")),
    __param(7, mongoose_1.InjectModel("Alarm")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        rules_service_1.RulesService,
        upload_service_1.UploadService,
        push_notification_service_1.PushNotificationService,
        user_service_1.UserService])
], LeadService);
exports.LeadService = LeadService;
//# sourceMappingURL=lead.service.js.map