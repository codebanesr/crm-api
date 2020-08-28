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
exports.leadActivityByUser = void 0;
const lead_1 = __importDefault(require("../../models/lead"));
exports.leadActivityByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const { startDate, endDate } = req.query;
    const updatedAtQuery = getUpdatedAtQuery(startDate, endDate);
    const qb = lead_1.default.aggregate();
    qb.match(Object.assign({ email }, updatedAtQuery));
    qb.group({
        _id: { leadStatus: "$leadStatus" },
        myCount: { $sum: 1 },
    });
    console.log(qb.pipeline());
    const result = yield qb.exec();
    return res.status(200).json(result);
});
const getUpdatedAtQuery = (startDate, endDate) => {
    const uq = { "updatedAt": { "$gt": new Date("1000-01-01T00:00:00.000Z") } };
    if (startDate) {
        uq.updatedAt["$gt"] = new Date(startDate);
    }
    if (endDate) {
        uq.updatedAt["$lt"] = new Date(endDate);
    }
    return uq;
};
//# sourceMappingURL=performance.js.map