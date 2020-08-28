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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.patch = exports.findOneById = exports.insertMany = exports.findAll = void 0;
const Customer_1 = __importDefault(require("../../models/Customer"));
const AdminAction_1 = __importDefault(require("../../models/AdminAction"));
const parseExcel_1 = __importDefault(require("../../util/parseExcel"));
const mongoose_1 = __importDefault(require("mongoose"));
const ticket_1 = __importDefault(require("../../models/ticket"));
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const CampaignConfig_1 = __importDefault(require("../../models/CampaignConfig"));
const xlsx_1 = __importDefault(require("xlsx"));
const lead_1 = __importDefault(require("../../models/lead"));
const campaign_1 = require("../campaign");
/** Findone and update implementation */
const saveLeads = (leads, others) => __awaiter(void 0, void 0, void 0, function* () {
    const created = [];
    const updated = [];
    const error = [];
    for (const l of leads) {
        const { lastErrorObject, value } = yield lead_1.default.findOneAndUpdate({ externalId: l.externalId }, l, { new: true, upsert: true, rawResult: true }).lean().exec();
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
    xlsx_1.default.writeFile(wb, "sheetjs.xlsx");
    console.log("created: ", created.length, "updated: ", updated.length, "error:", error.length);
});
const saveTickets = (tickets) => __awaiter(void 0, void 0, void 0, function* () {
    const created = [];
    const updated = [];
    const error = [];
    for (const t of tickets) {
        const { lastErrorObject, value } = yield ticket_1.default.findOneAndUpdate({ leadId: t.leadId }, t, { new: true, upsert: true, rawResult: true }).lean().exec();
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
    xlsx_1.default.writeFile(wb, "sheetjs.xlsx");
    console.log("created: ", created.length, "updated: ", updated.length, "error:", error.length);
});
/** Findone and update implementation */
const saveCustomers = (customers) => __awaiter(void 0, void 0, void 0, function* () {
    let bulk = Customer_1.default.collection.initializeUnorderedBulkOp();
    let c = 0;
    for (const cu of customers) {
        c++;
        bulk
            .find({ _id: cu._id })
            .upsert()
            .updateOne(cu);
        if (c % 1000 === 0) {
            bulk.execute((err, res) => {
                console.log("Finished iteration ", c % 1000);
                bulk = Customer_1.default.collection.initializeUnorderedBulkOp();
            });
        }
    }
    if (c % 1000 !== 0)
        bulk.execute((err, res) => {
            console.log("Finished iteration ", c % 1000, err, res);
        });
});
/** Findone and update implementation */
const saveCampaign = (campaigns) => __awaiter(void 0, void 0, void 0, function* () {
    let bulk = Campaign_1.default.collection.initializeUnorderedBulkOp();
    let c = 0;
    for (const ca of campaigns) {
        c++;
        bulk
            .find({ handler: ca.handler })
            .upsert()
            .updateOne(ca);
        if (c % 1000 === 0) {
            bulk.execute((err, res) => {
                console.log("Finished iteration ", c % 1000);
                bulk = Campaign_1.default.collection.initializeUnorderedBulkOp();
            });
        }
    }
    if (c % 1000 !== 0)
        bulk.execute((err, res) => {
            console.log("Finished iteration ", c % 1000, err, res);
        });
});
exports.findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, perPage, sortBy = "createdAt" } = req.query;
    const limit = Number(perPage);
    const skip = (Number(page) - 1) * limit;
    const result = yield Customer_1.default.aggregate([
        { $match: {} },
        { $sort: { [sortBy]: 1 } },
        { $skip: skip },
        { $limit: limit }
    ]);
    res.status(200).json(result);
});
/** This function should call a worker that will handle uploads, everything below this is to be pushed to worker
 * similarly the validator folder also goes inside the worker ..., file upload also happens in aws, then we send the url
 * to worker, the worker will then pick it up and execute
*/
const handleBulkUploads = (filePath, category, others) => __awaiter(void 0, void 0, void 0, function* () {
    let jsonRes;
    try {
        switch (category) {
            case "customer":
                jsonRes = parseExcel_1.default(filePath);
                saveCustomers(jsonRes);
                break;
            case "lead":
                const ccnfg = yield CampaignConfig_1.default.find({ name: "core" }, { readableField: 1, internalField: 1, _id: 0 }).lean().exec();
                jsonRes = parseExcel_1.default(filePath, ccnfg);
                saveLeads(jsonRes, others);
                break;
            case "ticket":
                jsonRes = parseExcel_1.default(filePath);
                saveTickets(jsonRes);
                break;
            case "campaign":
                jsonRes = parseExcel_1.default(filePath);
                saveCampaign(jsonRes);
                break;
            case "campaignSchema":
                jsonRes = parseExcel_1.default(filePath);
                campaign_1.saveCampaignSchema(jsonRes, others);
                break;
            default:
                console.log("The query param doesnot match a valid value", category);
        }
    }
    catch (e) {
        console.log(e);
    }
});
exports.insertMany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.query, { type: category } = _a, others = __rest(_a, ["type"]);
    const userid = req.user.id;
    handleBulkUploads(req.file.path, category, others);
    const adminActions = new AdminAction_1.default({
        userid: mongoose_1.default.Types.ObjectId(userid),
        actionType: "upload",
        filePath: req.file.path,
        savedOn: "disk",
        fileType: category
    });
    try {
        const result = yield adminActions.save();
        res.status(200).json({ success: true, filePath: req.file.path, message: "successfully parsed file" });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "An Error Occured while parsing the file" });
    }
});
exports.findOneById = (req, res, next) => {
    const id = req.params.productId;
    Customer_1.default.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/product"
                }
            });
        }
        else {
            res
                .status(404)
                .json({ message: "No valid entry found for provided ID" });
        }
    })
        .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
};
exports.patch = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Customer_1.default.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
        res.status(200).json({
            message: "Customer updated",
            request: {
                type: "GET",
                url: "http://localhost:3000/product/" + id
            }
        });
    })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.deleteOne = (req, res, next) => {
    const id = req.params.productId;
    Customer_1.default.remove({ _id: id })
        .exec()
        .then(result => {
        res.status(200).json({
            message: "Customer deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/product",
                body: { name: "String", price: "Number" }
            }
        });
    })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
//# sourceMappingURL=customer.js.map