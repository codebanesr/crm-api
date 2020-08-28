"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_1 = __importDefault(require("express"));
const express_flash_1 = __importDefault(require("express-flash"));
const express_session_1 = __importDefault(require("express-session"));
const lusca_1 = __importDefault(require("lusca"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const secrets_1 = require("../util/secrets");
const cors = __importStar(require("cors"));
const MongoStore = connect_mongo_1.default(express_session_1.default);
exports.default = (app) => {
    const mongoUrl = secrets_1.MONGODB_URI;
    app.set("port", process.env.PORT || 3000);
    app.use(compression_1.default());
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(express_session_1.default({
        resave: true,
        saveUninitialized: true,
        secret: secrets_1.SESSION_SECRET,
        store: new MongoStore({
            ssl: false,
            url: mongoUrl,
            autoReconnect: true,
        })
    }));
    app.use(cors.default());
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(express_flash_1.default());
    app.use(lusca_1.default.xframe("http://localhost:4200"));
    app.use(lusca_1.default.xssProtection(true));
    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });
    app.use((req, res, next) => {
        // After successful login, redirect back to the intended page
        if (!req.user &&
            req.path !== "/login" &&
            req.path !== "/signup" &&
            !req.path.match(/^\/auth/) &&
            !req.path.match(/\./)) {
            req.session.returnTo = req.path;
        }
        else if (req.user &&
            req.path == "/account") {
            req.session.returnTo = req.path;
        }
        next();
    });
    app.use(express_1.default.static(path_1.default.join(__dirname, "uploads"), { maxAge: 31557600000 }));
    app.use(express_1.default.static(path_1.default.join(__dirname, "public"), { maxAge: 31557600000 }));
};
//# sourceMappingURL=plugins.js.map