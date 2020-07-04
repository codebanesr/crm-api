import async from "async";
import crypto from "crypto";
import nodemailer from "nodemailer";
import passport from "passport";
import { User, UserDocument, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { WriteError } from "mongodb";
import { check, sanitize, validationResult } from "express-validator";
import "../config/passport";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../util/secrets";
import logger from "../util/logger";
import parseExcel from "../util/parseExcel";
import AdminAction from "../models/AdminAction";
import mongoose from "mongoose";
import { get } from "lodash";


import { getPermissionsArray } from "../controllers/role";
import { AuthReq } from "../interface/authorizedReq";


/**
 * GET /login
 * Login page.
 */
export const getLogin = (req: Request, res: Response) => {
    if (req.user) {
        return res.status(200).send("/");
    }
    res.send("account/login");
};

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("/login");
    }

    passport.authenticate("local", async (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) { return next(err); }
        if (!user) {
            logger.warn("User not found");
            return res.status(200).send("/login");
        }
        const permissions = await getPermissionsArray(user.roleType);
        const token = jwt.sign({ email: req.body.email, permissions }, JWT_SECRET);
        res.status(200).send({ token: token, permissions });
    })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
export const logout = (req: Request, res: Response) => {
    req.logout();
    res.status(200).send("/");
};

/**
 * GET /signup
 * Signup page.
 */
export const getSignup = (req: Request, res: Response) => {
    if (req.user) {
        return res.status(200).send("/");
    }
    res.send("account/signup");
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("/signup");
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            logger.warn("Account with that email address already exists.");
            return res.status(200).send("/signup");
        }
        user.save((err) => {
            if (err) { return next(err); }
            const token = jwt.sign({ email: req.body.email }, JWT_SECRET);
            res.status(200).send({ token: token });
        });
    });
};

/**
 * GET /account
 * Profile page.
 */
export const getAccount = (req: Request, res: Response) => {
    res.send("account/profile");
};

/**
 * POST /account/profile
 * Update profile information.
 */
export const postUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("/account");
    }

    const user = req.user as UserDocument;
    User.findById(user.id, (err, user: UserDocument) => {
        if (err) { return next(err); }
        user.email = req.body.email || "";
        user.profile.name = req.body.name || "";
        user.profile.gender = req.body.gender || "";
        user.profile.location = req.body.location || "";
        user.profile.website = req.body.website || "";
        user.save((err: WriteError) => {
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
};

/**
 * POST /account/password
 * Update current password.
 */
export const postUpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("/account");
    }

    const user = req.user as UserDocument;
    User.findById(user.id, (err, user: UserDocument) => {
        if (err) { return next(err); }
        user.password = req.body.password;
        user.save((err: WriteError) => {
            if (err) { return next(err); }
            req.flash("success", { msg: "Password has been changed." });
            res.status(200).send("/account");
        });
    });
};

/**
 * POST /account/delete
 * Delete user account.
 */
export const postDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    User.remove({ _id: user.id }, (err) => {
        if (err) { return next(err); }
        req.logout();
        req.flash("info", { msg: "Your account has been deleted." });
        res.status(200).send("/");
    });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
export const getOauthUnlink = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.params.provider;
    const user = req.user as UserDocument;
    User.findById(user.id, (err, user: any) => {
        if (err) { return next(err); }
        user[provider] = undefined;
        user.tokens = user.tokens.filter((token: AuthToken) => token.kind !== provider);
        user.save((err: WriteError) => {
            if (err) { return next(err); }
            req.flash("info", { msg: `${provider} account has been unlinked.` });
            res.status(200).send("/account");
        });
    });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
export const getReset = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return res.status(200).send("/");
    }
    User
        .findOne({ passwordResetToken: req.params.token })
        .where("passwordResetExpires").gt(Date.now())
        .exec((err, user) => {
            if (err) { return next(err); }
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
export const postReset = async (req: Request, res: Response, next: NextFunction) => {
    await check("password", "Password must be at least 4 characters long.").isLength({ min: 4 }).run(req);
    await check("confirm", "Passwords must match.").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("back");
    }

    async.waterfall([
        function resetPassword(done: Function) {
            User
                .findOne({ passwordResetToken: req.params.token })
                .where("passwordResetExpires").gt(Date.now())
                .exec((err, user: any) => {
                    if (err) { return next(err); }
                    if (!user) {
                        req.flash("errors", { msg: "Password reset token is invalid or has expired." });
                        return res.status(200).send("back");
                    }
                    user.password = req.body.password;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    user.save((err: WriteError) => {
                        if (err) { return next(err); }
                        req.logIn(user, (err) => {
                            done(err, user);
                        });
                    });
                });
        },
        function sendResetPasswordEmail(user: UserDocument, done: Function) {
            const transporter = nodemailer.createTransport({
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
        if (err) { return next(err); }
        res.status(200).send("/");
    });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
export const getForgot = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        return res.status(200).send("/");
    }
    res.send("account/forgot");
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
export const postForgot = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.status(200).send("/forgot");
    }

    async.waterfall([
        function createRandomToken(done: Function) {
            crypto.randomBytes(16, (err, buf) => {
                const token = buf.toString("hex");
                done(err, token);
            });
        },
        function setRandomToken(token: AuthToken, done: Function) {
            User.findOne({ email: req.body.email }, (err, user: any) => {
                if (err) { return done(err); }
                if (!user) {
                    req.flash("errors", { msg: "Account with that email address does not exist." });
                    return res.status(200).send("/forgot");
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user.save((err: WriteError) => {
                    done(err, token, user);
                });
            });
        },
        function sendForgotPasswordEmail(token: AuthToken, user: UserDocument, done: Function) {
            const transporter = nodemailer.createTransport({
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
        if (err) { return next(err); }
        res.status(200).send("/forgot");
    });
};


/** returns subordinates if exists else returns the same id that was passed, in case of manager or sm it will return email ids of all
 * subordinates, in case of frontline it will return the email of the frontline itself
 */
export const getSubordinates = async (user: UserDocument): Promise<string[]> => {
    if (user.roleType !== "manager" && user.roleType !== "seniorManager") {
        return [user.email];
    }
    const fq: any = [
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

    const result = await User.aggregate(fq);
    return result[0].subordinates;
};


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
export const getAll = async (req: AuthReq, res: Response, next: NextFunction) => {
    const { assigned } = req.query;
    // if(!assigned) {
    //     const users = await User.aggregate([
    //         { $match: { email: { $exists: false } } }
    //     ]);
    //     return res.status(200).send(users);
    // }
    const subordinates = await getSubordinates(req.user as any);
    const users = await User.aggregate([
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
};

export const insertMany = async (req: Request, res: Response, next: NextFunction) => {
    const userid = (req.user as Express.User & { id: string }).id;
    const jsonRes = parseExcel(req.file.path);

    const adminActions = new AdminAction({
        userid: mongoose.Types.ObjectId(userid),
        actionType: "upload",
        filePath: req.file.path,
        savedOn: "disk",
        fileType: "agentBulk"
    });


    await addNewUsers(jsonRes); //this will send uploaded path to the worker, or aws s3 location
    try {
        const result = await adminActions.save();
        res.status(200).json({ success: true, filePath: req.file.path, message: "successfully parsed file" });
    } catch (e) {
        res.status(500).json({ success: false, message: "An Error Occured while parsing the file" });
    }
};

export const getLatestUploadedFiles = async (req: Request, res: Response, next: NextFunction) => {
    const { fileType } = req.query;
    const qRes = AdminAction.find({ fileType: fileType }, { filePath: 1 }).sort({ _id: -1 }).limit(5) as any;
    return res.status(200).json({ filePath: qRes });
};

const parseManages = (user: any) => {
    if (!user.manages) return [];
    const manages = user.manages.replace(/\s/g, "").split(",");
    return manages;
};


const assignHierarchyWeight = (u: UserDocument) => {
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
const addNewUsers = async (users: UserDocument[]) => {
    const erroredUsers: any = [];
    for (const u of users) {
        /** check all users in the manages section exist, even if they dont it won't cause any trouble though */
        u.manages = parseManages(u);
        u.hierarchyWeight = assignHierarchyWeight(u);
        u.email = u.email.toLocaleLowerCase();

        User.findOne({ email: u.email }, (err, existingUser) => {
            if (err) {
                const errorMessage = err.message;
                erroredUsers.push({ ...u, errorMessage });
            }
            if (existingUser) {
                const errorMessage = "Account with that email address already exists.";
                erroredUsers.push({ ...existingUser, errorMessage });
            }

            const user = new User(u);
            user.save((err) => {
                if (err) {
                    console.log(err);
                    const errorMessage = err.message;
                    erroredUsers.push({ ...u, errorMessage });
                }
            });
        });
    }

    console.log(erroredUsers);
};


export const assignManager = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const { newManager, user } = req.body;

        const managedBy = get(user, "managedBy.email");
        await User.findOneAndUpdate({ email: managedBy }, { $pullAll: { manages: [user.email] } });

        await User.findOneAndUpdate({ email: newManager.email }, { $addToSet: { manages: user.email } });

        const assigned = user.managedBy ? "reassigned" : "assigned";
        let note = "";
        if (managedBy) {
            note = `User ${assigned} from ${managedBy} to ${newManager.email} by ${req.user.email}`;
        } else {
            note = `User ${assigned} to ${newManager.email} by ${req.user.email}`;
        }
        const history = {
            oldManager: managedBy,
            newManager: newManager.email,
            time: Date.now(),
            note
        };
        const result = await User.findOneAndUpdate({ email: user.email }, { $push: { history: history } }).lean().exec();
        return res.status(200).json(result);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }

};




export const getUserReassignmentHistory = async(req: Request, res: Response) => {
    const userEmail = req.query.email;
    try {
        const result = await User.aggregate([
            {$match: {email: userEmail}},
            {$project: {history: 1}},
            {$unwind: "$history"},
            {$sort: {time: 1}},
            {$limit: 5},
            {$replaceRoot: { newRoot: "$history" }}
        ]);
    
        res.status(200).send(result);
    }catch(e) {
        res.status(400).send({error: e.message});;
    }
};


// should be handled in database query itself, this is not the correct method
export const managersForReassignment = async (req: AuthReq, res: Response, next: NextFunction) => {
    const users = await User.find({
        $and: [
            { email: { $in: req.user.manages } },
            { roleType: { $ne: "frontline" } }
        ]
    }, { email: 1 });
    return res.status(200).send(users);
};