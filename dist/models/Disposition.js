"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dispositionSchema = new mongoose_1.default.Schema({
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    campaign: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Campaign'
    },
    options: [{
            title: String,
            key: String,
            expanded: Boolean,
            children: [
                {
                    title: String,
                    key: String,
                    isLeaf: Boolean,
                    children: [{}]
                }
            ]
        }]
}, {
    timestamps: true,
    autoIndex: true,
    strict: false
});
exports.default = mongoose_1.default.model("GeoLocation", dispositionSchema);
//# sourceMappingURL=Disposition.js.map