"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const contactRoutes_1 = __importDefault(require("../routes/contactRoutes"));
const customerRoutes_1 = __importDefault(require("../routes/customerRoutes"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const leadRoutes_1 = __importDefault(require("../routes/leadRoutes"));
const ticketRoutes_1 = __importDefault(require("../routes/ticketRoutes"));
const campaignRoutes_1 = __importDefault(require("../routes/campaignRoutes"));
const roleRoutes_1 = __importDefault(require("../routes/roleRoutes"));
const agentRoutes_1 = __importDefault(require("../routes/agentRoutes"));
const alarmRoutes_1 = __importDefault(require("../routes/alarmRoutes"));
exports.default = (app) => {
    app.use("/auth", authRoutes_1.default);
    app.use("/user", userRoutes_1.default);
    app.use("/contact", contactRoutes_1.default);
    app.use("/customer", customerRoutes_1.default);
    app.use("/lead", leadRoutes_1.default);
    app.use("/ticket", ticketRoutes_1.default);
    app.use("/campaign", campaignRoutes_1.default);
    app.use("/agent", agentRoutes_1.default);
    app.use("/roles", roleRoutes_1.default);
    app.use("/alarm", alarmRoutes_1.default);
};
//# sourceMappingURL=initRoutes.js.map