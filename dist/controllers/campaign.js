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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Campaign_1 = __importDefault(require("../models/Campaign"));
const parseExcel_1 = __importDefault(require("../util/parseExcel"));
exports.findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, perPage = 20, filters = {}, sortBy = "handler" } = req.body;
    const limit = Number(perPage);
    const skip = Number((page - 1) * limit);
    const { handlerEmail, campaigns = [] } = filters;
    const matchQ = {};
    matchQ.$and = [];
    if (handlerEmail) {
        matchQ.$and.push({ handler: handlerEmail });
    }
    if (campaigns && campaigns.length > 0) {
        matchQ.$and.push({ type: { $in: campaigns } });
    }
    const fq = [
        { $match: matchQ },
        { $sort: { [sortBy]: 1 } },
        { $skip: skip },
        { $limit: limit }
    ];
    if (fq[0]["$match"]["$and"].length === 0) {
        delete fq[0]["$match"]["$and"];
    }
    console.log(JSON.stringify(fq));
    const result = yield Campaign_1.default.aggregate(fq);
    res.status(200).json(result);
});
exports.findOneById = (req, res, next) => {
    const id = req.params.campaignId;
    Campaign_1.default.findById(id)
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
    const id = req.params.campaignId;
    const updateOps = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Campaign_1.default.update({ _id: id }, { $set: updateOps })
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
    const id = req.params.campaignId;
    Campaign_1.default.remove({ _id: id })
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
exports.getHandlerEmailHints = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = 15;
    const { partialEmail } = req.query;
    const result = yield Campaign_1.default.aggregate([
        {
            $match: {
                handler: { $regex: `^${partialEmail}` }
            }
        }, {
            $project: { handler: 1, _id: 0 }
        },
        { $limit: limit }
    ]);
    return res.status(200).send(result.map(r => r.handler));
});
exports.getCampaignTypes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hint } = req.query;
    const result = yield Campaign_1.default.find({ type: { $regex: "^" + hint, $options: "I" } }).limit(20);
    return res.status(200).send(result);
});
exports.uploadConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const path = req.file.path;
    const excelObject = parseExcel_1.default(path);
});
//# sourceMappingURL=campaign.js.map