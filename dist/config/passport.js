"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
// import passportApiKey from "passport-headerapikey";
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_local_1 = __importDefault(require("passport-local"));
const User_1 = require("../models/User");
const secrets_1 = require("../util/secrets");
const LocalStrategy = passport_local_1.default.Strategy;
const JwtStrategy = passport_jwt_1.default.Strategy;
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
passport_1.default.serializeUser((user, done) => {
    done(undefined, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    User_1.User.findById(id, (err, user) => {
        done(err, user);
    });
});
/**
 * Sign in using Email and Password.
 */
passport_1.default.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User_1.User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: "Invalid email or password." });
        });
    });
}));
passport_1.default.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secrets_1.JWT_SECRET,
}, function (jwtToken, done) {
    User_1.User.findOne({ email: jwtToken.email }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(undefined, user, jwtToken);
        }
        else {
            return done(undefined, false);
        }
    });
}));
/**
 * Login Required middleware.
 */
exports.authenticateJWT = (req, res, next) => {
    passport_1.default.authenticate("jwt", function (err, user, info) {
        if (err) {
            console.log(err);
            return res.status(401).json({ status: "error", code: "unauthorized" });
        }
        if (!user) {
            return res.status(401).json({ status: "error", code: "unauthorized" });
        }
        else {
            req.user = user;
            req.isAuthenticated = () => true;
            return next();
        }
    })(req, res, next);
};
/**
 * Authorization Required middleware.
 */
exports.authorizeJWT = (req, res, next) => {
    passport_1.default.authenticate("jwt", function (err, user, jwtToken) {
        if (err) {
            console.log(err);
            return res.status(401).json({ status: "error", code: "unauthorized" });
        }
        if (!user) {
            return res.status(401).json({ status: "error", code: "unauthorized" });
        }
        else {
            const scope = req.baseUrl.split("/").slice(-1)[0];
            const authScope = jwtToken.scope;
            if (authScope && authScope.indexOf(scope) > -1) {
                return next();
            }
            else {
                return res.status(401).json({ status: "error", code: "unauthorized" });
            }
        }
    })(req, res, next);
};
//# sourceMappingURL=passport.js.map