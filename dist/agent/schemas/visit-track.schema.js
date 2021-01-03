"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitTrackSchema = void 0;
const mongoose_1 = require("mongoose");
exports.VisitTrackSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    batLvl: Number,
    isGpsEnabled: Boolean,
    locations: [{
            lat: Number,
            lng: Number,
            timestamp: Date
        }]
}, { timestamps: true });
//# sourceMappingURL=visit-track.schema.js.map