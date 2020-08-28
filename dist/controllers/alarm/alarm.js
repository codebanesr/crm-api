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
exports.createAlarm = exports.deleteOne = exports.patch = exports.findOneById = exports.findAll = void 0;
const Alarm_1 = __importDefault(require("../../models/Alarm"));
exports.findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, perPage = 20, filters = {}, sortBy = 'createdAt' } = req.body;
    const limit = Number(perPage);
    const skip = Number((page - 1) * limit);
    const fq = [
        { $match: {} },
        { $sort: { [sortBy]: 1 } },
        { $skip: skip },
        { $limit: limit }
    ];
    console.log(JSON.stringify(fq));
    const result = yield Alarm_1.default.aggregate(fq);
    res.status(200).json(result);
});
exports.findOneById = (req, res, next) => {
    const id = req.params.alarmId;
    Alarm_1.default.findById(id)
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
    const id = req.params.alarmId;
    const updateOps = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Alarm_1.default.update({ _id: id }, { $set: updateOps })
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
    const id = req.params.alarmId;
    Alarm_1.default.remove({ _id: id })
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
exports.createAlarm = (alarmObj) => __awaiter(void 0, void 0, void 0, function* () {
    const alarm = new Alarm_1.default(alarmObj);
    const result = yield alarm.save();
    return result;
});
//# sourceMappingURL=alarm.js.map