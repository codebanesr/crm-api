
import * as core from "express-serve-static-core";
import authRoutes from "../routes/authRoutes";
import userRoutes from "../routes/userRoutes";
import contactRoutes from "../routes/contactRoutes";
import productRoutes from "../routes/productRoutes";


export default (app: core.Express) => {
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("/contact", contactRoutes);
    app.use("/product", productRoutes)
};