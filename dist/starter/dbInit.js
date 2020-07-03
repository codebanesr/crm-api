"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const mongoose_1 = __importDefault(require("mongoose"));
const secrets_1 = require("../util/secrets");
exports.default = (app) => {
    // Connect to MongoDB
    const mongoUrl = secrets_1.MONGODB_URI;
    mongoose_1.default.Promise = bluebird_1.default;
    mongoose_1.default.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => { }).catch(err => {
        console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
        // process.exit();
    });
};
//# sourceMappingURL=dbInit.js.map