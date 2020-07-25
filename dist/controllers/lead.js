"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lead_1 = __importDefault(require("../models/lead"));
const EmailTemplate_1 = __importDefault(require("../models/EmailTemplate"));
const alarm_1 = require("./alarm");
const CampaignConfig_1 = __importDefault(require("../models/CampaignConfig"));
const userController = __importStar(require("../controllers/user"));
const sendMail_1 = require("../util/sendMail");
const lodash_1 = require("lodash");
const parseExcel_1 = __importDefault(require("../util/parseExcel"));
const xlsx_1 = __importDefault(require("xlsx"));
const CallLog_1 = __importDefault(require("../models/CallLog"));
const fs = __importStar(require("fs"));
const GeoLocation_1 = __importDefault(require("../models/GeoLocation"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.saveEmailAttachments = (req, res) => {
    const files = req.files;
    return res.status(200).send({ files });
};
exports.reassignLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldUserEmail, newUserEmail, lead } = req.body;
    try {
        const assigned = oldUserEmail ? "reassigned" : "assigned";
        let note = "";
        if (oldUserEmail) {
            note = `Lead ${assigned} from ${oldUserEmail} to ${newUserEmail} by ${req.user.email}`;
        }
        else {
            note = `Lead ${assigned} to ${newUserEmail} by ${req.user.email}`;
        }
        const history = {
            oldUser: oldUserEmail,
            newUser: newUserEmail,
            note,
        };
        const result = yield lead_1.default.updateOne({ externalId: lead.externalId }, { email: newUserEmail, $push: { history: history } })
            .lean()
            .exec();
        return res.status(200).json(result);
    }
    catch (e) {
        return res.status(400).send({ error: e.message });
    }
});
// filePath: String,
// fileName: String
exports.createEmailTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const { content, subject, campaign, attachments } = req.body;
    let acceptableAttachmentFormat = attachments.map((a) => {
        let { originalname: fileName, path: filePath } = a, others = __rest(a, ["originalname", "path"]);
        return Object.assign({ fileName,
            filePath }, others);
    });
    const emailTemplate = new EmailTemplate_1.default({
        campaign: campaign,
        email: email,
        content: content,
        subject: subject,
        attachments: acceptableAttachmentFormat,
    });
    const result = yield emailTemplate.save();
    return res.status(200).json(result);
});
// const result = await Campaign.find({type: {$regex: "^"+hint, $options:"I"}}).limit(20);
exports.getAllEmailTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, skip = 0, campaign } = req.query;
    const query = EmailTemplate_1.default.aggregate();
    const result = yield query
        .match({ campaign: { $regex: `^${campaign}`, $options: "I" } })
        .sort("type")
        .limit(limit)
        .skip(skip)
        .exec();
    return res.status(200).send(result);
});
exports.getLeadHistoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { externalId } = req.params;
    const history = yield lead_1.default.findOne({ externalId: externalId }, { history: 1, externalId });
    return res.status(200).send(history);
});
exports.getLeadReassignmentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const leadId = req.query.email;
    try {
        const result = yield lead_1.default.aggregate([
            { $match: { _id: leadId } },
            { $project: { history: 1 } },
            { $unwind: "$history" },
            { $sort: { time: 1 } },
            { $limit: 5 },
            { $replaceRoot: { newRoot: "$history" } },
        ]);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(400).send({ error: e.message });
    }
});
exports.getBasicOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lead_1.default.aggregate([
        { $group: { _id: "$leadStatus", count: { $sum: 1 } } },
    ]);
    const total = yield lead_1.default.count({});
    return res.status(200).send({ result, total });
});
exports.findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, perPage, sortBy = "createdAt", showCols, searchTerm, filters, } = req.body;
    const limit = Number(perPage);
    const skip = Number((+page - 1) * limit);
    const { assigned, archived, lead, ticket } = filters;
    const matchQ = { $and: [] };
    if (assigned) {
        const subordinateEmails = yield userController.getSubordinates(req.user);
        matchQ.$and.push({
            email: { $in: [...subordinateEmails, req.user.email] },
        });
    }
    else {
        matchQ.$and.push({ email: { $exists: false } });
    }
    if (searchTerm) {
        matchQ["$and"].push({ $text: { $search: searchTerm } });
    }
    let flds;
    if (showCols && showCols.length > 0) {
        flds = showCols;
    }
    else {
        flds = (yield CampaignConfig_1.default.find({ name: "core", checked: true }, { internalField: 1 })
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
        { $skip: skip },
        { $limit: limit },
    ];
    console.log(JSON.stringify(fq));
    const leads = yield lead_1.default.aggregate(fq);
    res.status(200).json(leads);
});
exports.getAllLeadColumns = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaignType = "core" } = req.query;
    const matchQ = { name: campaignType };
    const paths = yield CampaignConfig_1.default.aggregate([{ $match: matchQ }]);
    return res.status(200).send({ paths: paths });
});
exports.insertOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    // assiging it to the user that created the lead by default
    body.email = req.user.email;
    const lead = new lead_1.default(body);
    const result = yield lead.save();
    // move to worker
    yield alarm_1.createAlarm({
        module: "LEAD",
        tag: "LEAD_CREATE",
        severity: "LOW",
        userEmail: req.user.email,
        moduleId: result._id,
    });
    return res.status(201).json(result);
});
exports.findOneById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const leadId = req.params.leadId;
    const lead = yield lead_1.default.findOne({ externalId: leadId }).lean().exec();
    res.status(200).send(lead);
});
exports.patch = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    lead_1.default.update({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
        res.status(200).json({
            message: "Lead updated",
            request: {
                type: "GET",
                url: "http://localhost:3000/lead/" + id,
            },
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
};
exports.deleteOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.leadId;
    const result = yield lead_1.default.remove({ _id: id }).lean().exec();
    yield alarm_1.createAlarm({
        module: "LEAD",
        tag: "LEAD_CREATE",
        severity: "LOW",
        userEmail: req.user.email,
        moduleId: id,
    });
    res.status(200).json(result);
});
// {
//     filename: 'text3.txt',
//     path: '/path/to/file.txt'
// }
exports.sendBulkEmails = (req, res, next) => {
    let { emails, subject, text, attachments } = req.body;
    emails = lodash_1.isArray(emails) ? emails : [emails];
    emails = emails.join(",");
    try {
        sendMail_1.sendEmail(emails, subject, text, attachments);
        res.status(200).send({ success: true });
    }
    catch (e) {
        res.status(400).send({ error: e.message });
        console.log(e);
    }
};
exports.suggestLeads = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId, limit = 10 } = req.params;
    const query = lead_1.default.aggregate();
    query.match({ externalId: { $regex: `^${leadId}` }, email: req.user.email });
    query.project('externalId -_id');
    query.limit(Number(limit));
    // const query = [
    //     {
    //         $match: {
    //             externalId: {$regex: `^${externalId}`}
    //         }
    //     },
    //     { $project : { leadId : 1} },
    //     { $limit: 10 }
    // ];
    let result = yield query.exec();
    return res.status(200).json(result);
});
// {
//   campaignName: 'typeb',
//   comment: 'some info about the campaign, should reach multer',
//   type: 'Lead Generation',
//   interval: [ '2020-07-24T13:31:02.621Z', '2020-07-04T13:26:07.078Z' ]
// }
exports.uploadMultipleLeadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    let { campaignInfo } = req.body;
    campaignInfo = JSON.parse(campaignInfo);
    const ccnfg = yield CampaignConfig_1.default.find({ name: campaignInfo.campaignName }, { readableField: 1, internalField: 1, _id: 0 }).lean().exec();
    if (!ccnfg) {
        return res.status(400).json({ error: `Campaign with name ${campaignInfo.campaignName} not found, create a campaign before uploading leads for that campaign` });
    }
    const result = yield exports.parseLeadFiles(files, ccnfg, campaignInfo.campaignName);
    // parse data here
    res.status(200).send(files);
});
exports.syncPhoneCalls = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { callLogs } = req.body;
        fs.writeFileSync("callLogs.json", JSON.stringify(callLogs));
        const result = yield CallLog_1.default.insertMany(callLogs);
        return res.status(200).send(result);
    }
    catch (e) {
        return res.status(500).send({ error: e.message });
    }
});
exports.addGeolocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat, lng } = req.body;
    console.log(req.body);
    const { id } = req.user;
    var geoObj = new GeoLocation_1.default({
        userid: mongoose_1.default.Types.ObjectId(id),
        loc: {
            lat,
            lng
        }
    });
    const result = yield geoObj.save();
    return res.status(200).json(result);
});
exports.updateLead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { externalId } = req.params;
    let { lead } = req.body;
    // lead = lead.filter((l: any) => {
    //   return !!l;
    // })
    let obj = {};
    Object.keys(lead).forEach(key => {
        if (!!lead[key]) {
            obj[key] = lead[key];
        }
    });
    const result = yield lead_1.default.findOneAndUpdate({ externalId: externalId }, { $set: obj });
    return res.status(200).send(result);
});
exports.parseLeadFiles = (files, ccnfg, campaignName) => __awaiter(void 0, void 0, void 0, function* () {
    files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        const jsonRes = parseExcel_1.default(file.path, ccnfg);
        saveLeads(jsonRes, campaignName, file.originalname);
    }));
});
/** Findone and update implementation */
const saveLeads = (leads, campaignName, originalFileName) => __awaiter(void 0, void 0, void 0, function* () {
    const created = [];
    const updated = [];
    const error = [];
    for (const l of leads) {
        const { lastErrorObject, value } = yield lead_1.default.findOneAndUpdate({ externalId: l.externalId }, Object.assign(Object.assign({}, l), { campaign: campaignName }), { new: true, upsert: true, rawResult: true }).lean().exec();
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
    // createExcel files and update them to aws and then store the urls in database with AdminActions
    const created_ws = xlsx_1.default.utils.json_to_sheet(created);
    const updated_ws = xlsx_1.default.utils.json_to_sheet(updated);
    const wb = xlsx_1.default.utils.book_new();
    xlsx_1.default.utils.book_append_sheet(wb, updated_ws, "tickets updated");
    xlsx_1.default.utils.book_append_sheet(wb, created_ws, "tickets created");
    xlsx_1.default.writeFile(wb, originalFileName + "_system");
    console.log("created: ", created.length, "updated: ", updated.length, "error:", error.length);
});
//# sourceMappingURL=lead.js.map