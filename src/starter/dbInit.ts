
import bluebird from "bluebird";
import { MONGODB_URI } from "../util/secrets";
import mongoose from "mongoose";
import * as core from "express-serve-static-core";

export default (app: core.Express) => {
    // Connect to MongoDB
    const mongoUrl = MONGODB_URI;
    mongoose.Promise = bluebird;

    mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, server: { ssl: false } } ).then(
        () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
    ).catch(err => {
        console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
        // process.exit();
    });

}