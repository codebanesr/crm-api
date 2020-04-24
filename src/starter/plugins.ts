import bodyParser from "body-parser";
import compression from "compression"; // compresses requests
import mongo from "connect-mongo";
import express from "express";
import flash from "express-flash";
import * as core from "express-serve-static-core";
import session from "express-session";
import lusca from "lusca";
import passport from "passport";
import path from "path";
import { MONGODB_URI, SESSION_SECRET } from "../util/secrets";
const MongoStore = mongo(session);

export default (app: core.Express) => {
    const mongoUrl = MONGODB_URI;
    app.set("port", process.env.PORT || 3000);
    app.use(compression());
    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: SESSION_SECRET,
        store: new MongoStore({
            ssl: false,
            url: mongoUrl,
            autoReconnect: true,
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(lusca.xframe("SAMEORIGIN"));
    app.use(lusca.xssProtection(true));
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
        } else if (req.user &&
        req.path == "/account") {
            req.session.returnTo = req.path;
        }
        next();
    });
    app.use(express.static(path.join(__dirname, "uploads"), { maxAge: 31557600000 }));
    app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));
};

