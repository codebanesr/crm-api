
import * as core from "express-serve-static-core";
import authRoutes from "../routes/authRoutes";
import contactRoutes from "../routes/contactRoutes";
import customerRoutes from "../routes/customerRoutes";
import userRoutes from "../routes/userRoutes";


export default (app: core.Express) => {
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("/contact", contactRoutes);
    app.use("/customer", customerRoutes);
};