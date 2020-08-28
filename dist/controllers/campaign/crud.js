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
exports.deleteOne = exports.patch = exports.findOneByIdOrName = exports.findAll = void 0;
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const redis_container_1 = require("../../starter/redis-container");
exports.findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, perPage = 20, filters = {}, sortBy = "handler" } = req.body;
    const limit = Number(perPage);
    const skip = Number((page - 1) * limit);
    const { createdBy, campaigns = [] } = filters;
    const matchQ = {};
    matchQ.$and = [];
    if (createdBy) {
        matchQ.$and.push({ createdBy: createdBy });
    }
    if (campaigns && campaigns.length > 0) {
        matchQ.$and.push({ type: { $in: campaigns } });
    }
    const fq = [
        { $match: matchQ },
        { $sort: { [sortBy]: 1 } },
        {
            '$facet': {
                metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
                data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
            }
        }
    ];
    if (fq[0]["$match"]["$and"].length === 0) {
        delete fq[0]["$match"]["$and"];
    }
    console.log(JSON.stringify(fq));
    const result = yield Campaign_1.default.aggregate(fq);
    res.status(200).json({ data: result[0].data, metadata: result[0].metadata[0] });
});
exports.findOneByIdOrName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.campaignId;
        const { identifier } = req.query;
        const redisClient = redis_container_1.RedisContainer.getClient();
        const cachedCampaign = JSON.parse(yield redisClient.get(id));
        if (cachedCampaign) {
            return res.status(200).send(cachedCampaign);
        }
        let result;
        switch (identifier) {
            case 'campaignName':
                result = yield Campaign_1.default.findOne({ campaignName: id }).lean().exec();
                break;
            default:
                result = yield Campaign_1.default.findById(id).lean().exec();
        }
        redisClient.set(id, JSON.stringify(result));
        return res.status(200).json(result);
    }
    catch (e) {
        console.log(e.message);
        return res.status(500).json({ error: e.message });
    }
});
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
//# sourceMappingURL=crud.js.map