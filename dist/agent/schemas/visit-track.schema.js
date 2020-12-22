"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitTrackSchema = void 0;
const mongoose_1 = require("mongoose");
exports.VisitTrackSchema = new mongoose_1.Schema({
    userId: String,
    batteryStatus: Number,
    isGpsEnabled: Boolean,
    locations: [{
            lat: Number,
            lng: Number,
            timestamp: Date
        }]
}, { timestamps: true });
//# sourceMappingURL=visit-track.schema.js.map