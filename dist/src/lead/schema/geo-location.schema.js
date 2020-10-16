"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoLocationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.GeoLocationSchema = new mongoose_1.Schema({
    userid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    }
}, {
    timestamps: true
});
exports.GeoLocationSchema.index({ "loc": "2dsphere" });
//# sourceMappingURL=geo-location.schema.js.map