"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// add a lead priority index [An enum variable with list of priorities]
const geoLocationSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    userid: mongoose_1.default.Schema.Types.ObjectId,
    loc: {
        type: { type: String },
        coordinates: [Number],
    }
});
geoLocationSchema.index({ "loc": "2dsphere" });
exports.default = mongoose_1.default.model("Role", geoLocationSchema);
//# sourceMappingURL=GeoLocation.js.map