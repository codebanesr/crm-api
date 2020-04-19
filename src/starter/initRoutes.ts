
import * as core from "express-serve-static-core";
import authRoutes from '../../routes/authRoutes';
import userRoutes from '../../routes/userRoutes';
import contactRoutes from '../../routes/contactRoutes';

export default (app: core.Express) => {
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("/contact", contactRoutes);
}