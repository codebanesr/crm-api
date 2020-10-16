"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleSchema = void 0;
const mongoose = require("mongoose");
exports.ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 6,
        maxlength: 255,
        required: [true, 'TITLE_IS_BLANK'],
    },
    body: {
        type: String,
        required: [true, 'BODY_IS_BLANK'],
    }
}, {
    versionKey: false,
    timestamps: true,
});
//# sourceMappingURL=article.schema.js.map