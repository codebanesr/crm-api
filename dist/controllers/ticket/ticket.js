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
exports.deleteOne = exports.findByLeadId = exports.suggestLeads = exports.put = exports.findOneById = exports.insertOne = exports.findAll = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ticket_1 = __importDefault(require("../../models/ticket"));
const lead_1 = __importDefault(require("../../models/lead"));
exports.findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, perPage, sortBy = 'createdAt' } = req.query;
    const limit = Number(perPage);
    const skip = (Number(page) - 1) * limit;
    const result = yield ticket_1.default.aggregate([
        { $match: {} },
        { $sort: { [sortBy]: 1 } },
        { $skip: skip },
        { $limit: limit }
    ]);
    res.status(200).json(result);
});
exports.insertOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    console.log(body);
    const ticket = new ticket_1.default(Object.assign(Object.assign({}, body), { _id: new mongoose_1.default.Types.ObjectId() }));
    const result = yield ticket.save();
    return res.status(200).json(result);
});
exports.findOneById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = mongoose_1.default.Types.ObjectId(req.params.ticketId);
        const result = yield ticket_1.default.findById(id);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).send(`An error occured, ${error.message}`);
    }
});
exports.put = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.ticketId;
    const { body } = req;
    const result = yield ticket_1.default.update({ _id: id }, { $set: body });
    return res.status(200).json(result);
});
exports.suggestLeads = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId } = req.params;
    const query = [
        {
            $match: {
                _id: { $regex: `^${leadId}` }
            }
        },
        { $project: { leadId: 1 } },
        { $limit: 10 }
    ];
    const result = yield lead_1.default.aggregate(query);
    return res.status(200).json(result);
});
exports.findByLeadId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const lead = yield ticket_1.default.findOne({ leadId: req.params.leadId }, {});
    return res.status(200).json(lead);
});
exports.deleteOne = (req, res, next) => {
    const id = req.params.productId;
    ticket_1.default.remove({ _id: id })
        .exec()
        .then(result => {
        res.status(200).json({
            message: "Ticket deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/ticket",
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
//# sourceMappingURL=ticket.js.map