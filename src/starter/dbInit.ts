
import bluebird from "bluebird";
import * as core from "express-serve-static-core";
import mongoose from "mongoose";
import { MONGODB_URI } from "../util/secrets";

export default (app: core.Express) => {
    // Connect to MongoDB
    const mongoUrl = MONGODB_URI;
    mongoose.Promise = bluebird;

    mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
        () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
    ).catch(err => {
        console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
        // process.exit();
    });
};
