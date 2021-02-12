"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResellerOrganizationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ResellerOrganizationSchema = new mongoose_1.Schema({
    orgName: String,
    orgId: String,
    resellerName: String,
    resellerId: String,
    credit: Number
}, { timestamps: true });
//# sourceMappingURL=reseller-organization.schema.js.map