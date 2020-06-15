import * as core from "express-serve-static-core";
import authRoutes from "../routes/authRoutes";
import contactRoutes from "../routes/contactRoutes";
import customerRoutes from "../routes/customerRoutes";
import userRoutes from "../routes/userRoutes";
import leadRoutes from "../routes/leadRoutes";
import ticketRoutes from "../routes/ticketRoutes";
import campaignRoutes from "../routes/campaignRoutes";
import roleRoutes from "../routes/roleRoutes";
import agentRoutes from "../routes/agentRoutes";
import alarmRoutes from "../routes/alarmRoutes";


export default (app: core.Express) => {
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("/contact", contactRoutes);
    app.use("/customer", customerRoutes);
    app.use("/lead", leadRoutes);
    app.use("/ticket", ticketRoutes);
    app.use("/campaign", campaignRoutes);
    app.use("/agent", agentRoutes);
    app.use("/roles", roleRoutes);
    app.use("/alarm", alarmRoutes);
};