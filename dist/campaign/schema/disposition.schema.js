"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispositionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.DispositionSchema = new mongoose_1.Schema({
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    campaign: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Campaign",
    },
    organization: { type: mongoose_1.Types.ObjectId, ref: "Organization" },
    options: [
        {
            title: String,
            key: String,
            expanded: Boolean,
            children: [
                {
                    title: String,
                    key: String,
                    isLeaf: Boolean,
                    children: [{}],
                },
            ],
        },
    ],
}, {
    timestamps: true,
    autoIndex: true,
    strict: false,
});
//# sourceMappingURL=disposition.schema.js.map