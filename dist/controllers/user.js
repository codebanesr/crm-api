"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = __importDefault(require("async"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const passport_1 = __importDefault(require("passport"));
const User_1 = require("../models/User");
const express_validator_1 = require("express-validator");
require("../config/passport");
const jwt = __importStar(require("jsonwebtoken"));
const secrets_1 = require("../util/secrets");
const logger_1 = __importDefault(require("../util/logger"));
const parseExcel_1 = __importDefault(require("../util/parseExcel"));
const AdminAction_1 = __importDefault(require("../models/AdminAction"));
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = require("lodash");
const role_1 = require("../controllers/role");
/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.status(200).send("/");
    }
    res.send("account/login");
};
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("email", "Email is not valid").isEmail().run(req);
    yield express_validator_1.check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    yield express_validator_1.sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("/login");
    }
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(err);
        }
        if (!user) {
            logger_1.default.warn("User not found");
            return res.status(200).send("/login");
        }
        const permissions = yield role_1.getPermissionsArray(user.roleType);
        const token = jwt.sign({ email: req.body.email, permissions }, secrets_1.JWT_SECRET);
        res.status(200).send({ token: token, permissions });
    }))(req, res, next);
});
/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
    req.logout();
    res.status(200).send("/");
};
/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
    if (req.user) {
        return res.status(200).send("/");
    }
    res.send("account/signup");
};
/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("email", "Email is not valid").isEmail().run(req);
    yield express_validator_1.check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    yield express_validator_1.check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    yield express_validator_1.sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("/signup");
    }
    const user = new User_1.User({
        email: req.body.email,
        password: req.body.password
    });
    User_1.User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            logger_1.default.warn("Account with that email address already exists.");
            return res.status(200).send("/signup");
        }
        user.save((err) => {
            if (err) {
                return next(err);
            }
            const token = jwt.sign({ email: req.body.email }, secrets_1.JWT_SECRET);
            res.status(200).send({ token: token });
        });
    });
});
/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
    res.send("account/profile");
};
/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("email", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    yield express_validator_1.sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("/account");
    }
    const user = req.user;
    User_1.User.findById(user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.email = req.body.email || "";
        user.profile.name = req.body.name || "";
        user.profile.gender = req.body.gender || "";
        user.profile.location = req.body.location || "";
        user.profile.website = req.body.website || "";
        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash("errors", { msg: "The email address you have entered is already associated with an account." });
                    return res.status(200).send("/account");
                }
                return next(err);
            }
            req.flash("success", { msg: "Profile information has been updated." });
            res.status(200).send("/account");
        });
    });
});
/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    yield express_validator_1.check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("/account");
    }
    const user = req.user;
    User_1.User.findById(user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.password = req.body.password;
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", { msg: "Password has been changed." });
            res.status(200).send("/account");
        });
    });
});
/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
    const user = req.user;
    User_1.User.remove({ _id: user.id }, (err) => {
        if (err) {
            return next(err);
        }
        req.logout();
        req.flash("info", { msg: "Your account has been deleted." });
        res.status(200).send("/");
    });
};
/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
    const provider = req.params.provider;
    const user = req.user;
    User_1.User.findById(user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user[provider] = undefined;
        user.tokens = user.tokens.filter((token) => token.kind !== provider);
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash("info", { msg: `${provider} account has been unlinked.` });
            res.status(200).send("/account");
        });
    });
};
/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(200).send("/");
    }
    User_1.User
        .findOne({ passwordResetToken: req.params.token })
        .where("passwordResetExpires").gt(Date.now())
        .exec((err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("errors", { msg: "Password reset token is invalid or has expired." });
            return res.status(200).send("/forgot");
        }
        res.send("account/reset");
    });
};
/**
 * POST /auth/reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("password", "Password must be at least 4 characters long.").isLength({ min: 4 }).run(req);
    yield express_validator_1.check("confirm", "Passwords must match.").equals(req.body.password).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("back");
    }
    async_1.default.waterfall([
        function resetPassword(done) {
            User_1.User
                .findOne({ passwordResetToken: req.params.token })
                .where("passwordResetExpires").gt(Date.now())
                .exec((err, user) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash("errors", { msg: "Password reset token is invalid or has expired." });
                    return res.status(200).send("back");
                }
                user.password = req.body.password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                user.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    req.logIn(user, (err) => {
                        done(err, user);
                    });
                });
            });
        },
        function sendResetPasswordEmail(user, done) {
            const transporter = nodemailer_1.default.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: "express-ts@starter.com",
                subject: "Your password has been changed",
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash("success", { msg: "Success! Your password has been changed." });
                done(err);
            });
        }
    ], (err) => {
        if (err) {
            return next(err);
        }
        res.status(200).send("/");
    });
});
/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).send("/");
    }
    res.send("account/forgot");
};
/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("email", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    yield express_validator_1.sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("/forgot");
    }
    async_1.default.waterfall([
        function createRandomToken(done) {
            crypto_1.default.randomBytes(16, (err, buf) => {
                const token = buf.toString("hex");
                done(err, token);
            });
        },
        function setRandomToken(token, done) {
            User_1.User.findOne({ email: req.body.email }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    req.flash("errors", { msg: "Account with that email address does not exist." });
                    return res.status(200).send("/forgot");
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        function sendForgotPasswordEmail(token, user, done) {
            const transporter = nodemailer_1.default.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: "shanur.rahman@gamechangesns.com",
                subject: "Reset your password on Molecule",
                text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/auth/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash("info", { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
                done(err);
            });
        }
    ], (err) => {
        if (err) {
            return next(err);
        }
        res.status(200).send("/forgot");
    });
});
/** returns subordinates if exists else returns the same id that was passed, in case of manager or sm it will return email ids of all
 * subordinates, in case of frontline it will return the email of the frontline itself
 */
exports.getSubordinates = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.roleType !== "manager" && user.roleType !== "seniorManager") {
        return [user.email];
    }
    const fq = [
        { $match: { email: user.email } },
        {
            $graphLookup: {
                from: "users",
                startWith: "$manages",
                connectFromField: "manages",
                connectToField: "email",
                as: "subordinates"
            },
        },
        { $project: { "subordinates": "$subordinates.email", roleType: "$roleType", hierarchyWeight: 1 } }
    ];
    const result = yield User_1.User.aggregate(fq);
    return result[0].subordinates;
});
// sample aggregation query to get the count and results in one go
// db.users.aggregate([
//     {
//             $facet: {
//                     pipe1: [
//                         {$match: {email: /m/i}},
//                         {$limit : 3}
//                     ],
//                     pipe2: [
//                         { $count: "count" }
//                     ]
//             }
//     }
// ])
exports.getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { assigned } = req.query;
    if (!assigned) {
        const users = yield User_1.User.aggregate([
            { $match: { email: { $exists: false } } }
        ]);
        return res.status(200).send(users);
    }
    const subordinates = yield exports.getSubordinates(req.user);
    const users = yield User_1.User.aggregate([
        { $match: { email: { $in: subordinates } } },
        {
            $lookup: {
                from: "users",
                localField: "email",
                foreignField: "manages",
                as: "managedBy"
            }
        },
        { $unwind: "$managedBy" }
    ]);
    return res.status(200).send(users);
});
exports.insertMany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.id;
    const jsonRes = parseExcel_1.default(req.file.path);
    const adminActions = new AdminAction_1.default({
        userid: mongoose_1.default.Types.ObjectId(userid),
        actionType: "upload",
        filePath: req.file.path,
        savedOn: "disk",
        fileType: "agentBulk"
    });
    yield addNewUsers(jsonRes); //this will send uploaded path to the worker, or aws s3 location
    try {
        const result = yield adminActions.save();
        res.status(200).json({ success: true, filePath: req.file.path, message: "successfully parsed file" });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "An Error Occured while parsing the file" });
    }
});
exports.getLatestUploadedFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileType } = req.query;
    const qRes = AdminAction_1.default.find({ fileType: fileType }, { filePath: 1 }).sort({ _id: -1 }).limit(5);
    return res.status(200).json({ filePath: qRes });
});
const parseManages = (user) => {
    if (!user.manages)
        return [];
    const manages = user.manages.replace(/\s/g, "").split(",");
    return manages;
};
const assignHierarchyWeight = (u) => {
    switch (u.roleType.trim().toLocaleLowerCase()) {
        case "seniorManager":
            return 60;
        case "manager":
            return 40;
        case "frontline":
            return 20;
        default:
            return 0;
    }
};
// cannot do bulk upload here, need to generate passwords one by one and also cannot skip validation
const addNewUsers = (users) => __awaiter(void 0, void 0, void 0, function* () {
    const erroredUsers = [];
    for (const u of users) {
        /** check all users in the manages section exist, even if they dont it won't cause any trouble though */
        u.manages = parseManages(u);
        u.hierarchyWeight = assignHierarchyWeight(u);
        u.email = u.email.toLocaleLowerCase();
        User_1.User.findOne({ email: u.email }, (err, existingUser) => {
            if (err) {
                const errorMessage = err.message;
                erroredUsers.push(Object.assign(Object.assign({}, u), { errorMessage }));
            }
            if (existingUser) {
                const errorMessage = "Account with that email address already exists.";
                erroredUsers.push(Object.assign(Object.assign({}, existingUser), { errorMessage }));
            }
            const user = new User_1.User(u);
            user.save((err) => {
                if (err) {
                    console.log(err);
                    const errorMessage = err.message;
                    erroredUsers.push(Object.assign(Object.assign({}, u), { errorMessage }));
                }
            });
        });
    }
    console.log(erroredUsers);
});
exports.assignManager = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newManager, user } = req.body;
        const managedBy = lodash_1.get(user, "managedBy.email");
        yield User_1.User.findOneAndUpdate({ email: managedBy }, { $pullAll: { manages: [user.email] } });
        yield User_1.User.findOneAndUpdate({ email: newManager.email }, { $addToSet: { manages: user.email } });
        const assigned = user.managedBy ? "reassigned" : "assigned";
        let note = "";
        if (managedBy) {
            note = `User ${assigned} from ${managedBy} to ${newManager.email} by ${req.user.email}`;
        }
        else {
            note = `User ${assigned} to ${newManager.email} by ${req.user.email}`;
        }
        const history = {
            oldManager: managedBy,
            newManager: newManager.email,
            time: Date.now(),
            note
        };
        const result = yield User_1.User.findOneAndUpdate({ email: user.email }, { $push: { history: history } }).lean().exec();
        return res.status(200).json(result);
    }
    catch (e) {
        return res.status(400).json({ error: e.message });
    }
});
exports.getUserReassignmentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.query.email;
    try {
        const result = yield User_1.User.aggregate([
            { $match: { email: userEmail } },
            { $project: { history: 1 } },
            { $unwind: "$history" },
            { $sort: { time: 1 } },
            { $limit: 5 },
            { $replaceRoot: { newRoot: "$history" } }
        ]);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(400).send({ error: e.message });
        ;
    }
});
// should be handled in database query itself, this is not the correct method
exports.managersForReassignment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.User.find({
        $and: [
            { email: { $in: req.user.manages } },
            { roleType: { $ne: "frontline" } }
        ]
    }, { email: 1 });
    return res.status(200).send(users);
});
//# sourceMappingURL=user.js.map