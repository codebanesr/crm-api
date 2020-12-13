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
let LeadService = class LeadService {
    constructor(leadModel, adminActionModel, userModel, campaignConfigModel, campaignModel, emailTemplateModel, callLogModel, leadHistoryModel, geoLocationModel, alarmModel, s3UploadService, pushNotificationService) {
        this.leadModel = leadModel;
        this.adminActionModel = adminActionModel;
        this.userModel = userModel;
        this.campaignConfigModel = campaignConfigModel;
        this.campaignModel = campaignModel;
        this.emailTemplateModel = emailTemplateModel;
        this.callLogModel = callLogModel;
        this.leadHistoryModel = leadHistoryModel;
        this.geoLocationModel = geoLocationModel;
        this.alarmModel = alarmModel;
        this.s3UploadService = s3UploadService;
        this.pushNotificationService = pushNotificationService;
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
    findAll(page, perPage, sortBy = "createdAt", showCols, searchTerm, filters, activeUserEmail, roleType, organization, typeDict) {
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
                const subordinateEmails = yield this.getSubordinates(activeUserEmail, roleType, organization);
                leadAgg.match({
                    email: { $in: [...subordinateEmails, activeUserEmail] },
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
                projectQ[fld] = { $ifNull: [`$${fld}`, "---"] };
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
    getLeadColumns(campaignId = "core") {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = yield this.campaignConfigModel.find({ campaignId });
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
                .findOne({ _id: leadId, organization })
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
    createLead(body, email, organization, campaignId, campaignName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contact, lead } = body;
            yield this.leadModel.create(Object.assign(Object.assign({}, lead), { campaign: campaignName, organization,
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
            const ccnfg = yield this.campaignConfigModel.find({ campaignId }, { readableField: 1, internalField: 1, _id: 0 });
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
            const result = yield this.parseLeadFiles(files, ccnfg, campaignName, organization, uploader, userId, pushtoken, campaignId);
            return { files, result };
        });
    }
    syncPhoneCalls(callLogs, organization, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transformed = callLogs.map((callLog) => {
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
    updateLead({ organization, leadId, lead, geoLocation, loggedInUserEmail, reassignmentInfo, emailForm, requestedInformation, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let obj = {};
            common_1.Logger.debug({ geoLocation, reassignmentInfo });
            const keysToUpdate = Object.keys(lead);
            if (keysToUpdate.length > 25) {
                throw new common_1.PreconditionFailedException(null, "Cannot have more than 25 fields in the lead schema");
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
                nextEntryInHistory.notes = `Lead has been assigned to ${loggedInUserEmail} by default`;
                nextEntryInHistory.newUser = loggedInUserEmail;
            }
            if (reassignmentInfo && (prevHistory === null || prevHistory === void 0 ? void 0 : prevHistory.newUser) !== reassignmentInfo.newUser) {
                nextEntryInHistory.notes = `Lead has been assigned to ${reassignmentInfo.newUser} by ${loggedInUserEmail}`;
                nextEntryInHistory.oldUser = prevHistory.newUser;
                nextEntryInHistory.newUser = reassignmentInfo.newUser;
            }
            if (lead.leadStatus !== oldLead.leadStatus) {
                nextEntryInHistory.notes = `Lead status changed from ${oldLead.leadStatus} to ${lead.leadStatus} by ${loggedInUserEmail}`;
            }
            nextEntryInHistory.geoLocation = geoLocation;
            if (requestedInformation && Object.keys(requestedInformation).length > 0) {
                nextEntryInHistory["requestedInformation"] = requestedInformation.filter((ri) => Object.keys(ri).length > 0);
            }
            nextEntryInHistory.prospectName = `${lead.firstName} ${lead.lastName}`;
            nextEntryInHistory.leadStatus = lead.leadStatus;
            nextEntryInHistory.followUp = (_a = lead.followUp) === null || _a === void 0 ? void 0 : _a.toString();
            nextEntryInHistory.organization = organization;
            lead.nextAction && (nextEntryInHistory.nextAction = lead.nextAction);
            let { contact } = obj, filteredObj = __rest(obj, ["contact"]);
            if (lodash_1.get(reassignmentInfo, "newUser")) {
                obj.email = reassignmentInfo.newUser;
            }
            const result = yield this.leadModel.findOneAndUpdate({ _id: leadId, organization }, { $set: filteredObj });
            yield this.leadHistoryModel.create(nextEntryInHistory);
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
    getSubordinates(email, roleType, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            if (roleType === "frontline") {
                return [email];
            }
            const fq = [
                { $match: { organization, email: email, verified: true } },
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
            return [email, ...result[0].subordinates];
        });
    }
    parseLeadFiles(files, ccnfg, campaignName, organization, uploader, uploaderId, pushtoken, campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                const jsonRes = yield parseExcel_1.default(file.Location, ccnfg);
                yield this.saveLeadsFromExcel(jsonRes, campaignName, file.Key, organization, uploader, uploaderId, pushtoken, campaignId);
            }));
        });
    }
    saveLeadsFromExcel(leads, campaignName, originalFileName, organization, uploader, uploaderId, pushtoken, campaignId) {
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
            const leadMappings = lodash_1.keyBy(leadColumns, "internalField");
            for (const lead of leads) {
                let contact = [];
                Object.keys(lead).forEach((key) => {
                    if (leadMappings[key].group === "contact") {
                        contact.push({
                            label: leadMappings[key].readableField,
                            value: lead[key],
                        });
                        delete lead[key];
                    }
                });
                const { lastErrorObject, value } = yield this.leadModel
                    .findOneAndUpdate({ externalId: lead.externalId }, Object.assign(Object.assign({}, lead), { campaign: campaignName, contact, organization, uploader, campaignId }), { new: true, upsert: true, rawResult: true })
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
            const adminActions = new this.adminActionModel({
                label: fileName,
                userid: uploaderId,
                organization,
                actionType: "lead",
                filePath: result.Location,
                savedOn: "s3",
                fileType: "lead",
            });
            yield adminActions.save();
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
    fetchNextLead({ campaignId, filters, email, organization, typeDict, }) {
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
            singleLeadAgg.match({ campaign: campaign.campaignName, email });
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
            singleLeadAgg.sort({ _id: 1 });
            singleLeadAgg.limit(1);
            let projection = {};
            campaign.browsableCols.forEach((c) => {
                projection[c] = 1;
            });
            projection["contact"] = 1;
            projection["nextAction"] = 1;
            singleLeadAgg.project(projection);
            const lead = (yield singleLeadAgg.exec())[0];
            if (lead) {
                const leadHistory = yield this.leadHistoryModel
                    .find({ lead: lead._id })
                    .limit(5);
                lead.history = leadHistory;
            }
            return Promise.resolve({ result: lead });
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
    getTransactions(organization, email, roleType, payload) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let conditionalQueries = {};
            let subordinateEmails = yield this.getSubordinates(email, roleType, organization);
            if (((_b = (_a = payload.filters) === null || _a === void 0 ? void 0 : _a.handler) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                subordinateEmails = lodash_1.intersection(payload.filters.handler, subordinateEmails, [email]);
            }
            ;
            if ((_c = payload.filters) === null || _c === void 0 ? void 0 : _c.prospectName) {
            }
            if ((_d = payload.filters) === null || _d === void 0 ? void 0 : _d.campaign) {
                conditionalQueries["campaign"] = payload.filters.campaign;
            }
            if ((_e = payload.filters) === null || _e === void 0 ? void 0 : _e.startDate) {
                conditionalQueries["createdAt"] = {};
                conditionalQueries["createdAt"]["$gte"] = new Date(payload.filters.startDate);
            }
            if ((_f = payload.filters) === null || _f === void 0 ? void 0 : _f.endDate) {
                conditionalQueries["createdAt"]["$lte"] = new Date(payload.filters.endDate);
            }
            const sortOrder = payload.pagination.sortOrder === "ASC" ? 1 : -1;
            return this.leadHistoryModel
                .find(Object.assign({ organization, newUser: { $in: subordinateEmails } }, conditionalQueries))
                .sort({ [payload.pagination.sortBy]: sortOrder })
                .limit(payload.pagination.perPage);
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
    __param(2, mongoose_1.InjectModel("User")),
    __param(3, mongoose_1.InjectModel("CampaignConfig")),
    __param(4, mongoose_1.InjectModel("Campaign")),
    __param(5, mongoose_1.InjectModel("EmailTemplate")),
    __param(6, mongoose_1.InjectModel("CallLog")),
    __param(7, mongoose_1.InjectModel("LeadHistory")),
    __param(8, mongoose_1.InjectModel("GeoLocation")),
    __param(9, mongoose_1.InjectModel("Alarm")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        upload_service_1.UploadService,
        push_notification_service_1.PushNotificationService])
], LeadService);
exports.LeadService = LeadService;
//# sourceMappingURL=lead.service.js.map