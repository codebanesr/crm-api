"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const auth_service_1 = require("./../auth/auth.service");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const bcrypt = require("bcryptjs");
const parseExcel_1 = require("../utils/parseExcel");
const xlsx_1 = require("xlsx");
const path_1 = require("path");
const config_1 = require("../config");
const nodemailer_1 = require("nodemailer");
const forgot_password_template_1 = require("../utils/forgot-password-template");
let UserService = class UserService {
    constructor(userModel, forgotPasswordModel, adminActionModel, authService) {
        this.userModel = userModel;
        this.forgotPasswordModel = forgotPasswordModel;
        this.adminActionModel = adminActionModel;
        this.authService = authService;
        this.HOURS_TO_VERIFY = 4;
        this.HOURS_TO_BLOCK = 6;
        this.LOGIN_ATTEMPTS_TO_BLOCK = 5;
    }
    create(createUserDto, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new this.userModel(Object.assign(Object.assign({}, createUserDto), { organization, verified: true }));
            yield this.isEmailUnique(user.email);
            this.setRegistrationInfo(user);
            yield user.save();
            return this.buildRegistrationInfo(user);
        });
    }
    verifyEmail(req, verifyUuidDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByVerification(verifyUuidDto.verification);
            yield this.setUserAsVerified(user);
            return {
                fullName: user.fullName,
                email: user.email,
                accessToken: yield this.authService.createAccessToken(user._id),
                refreshToken: yield this.authService.createRefreshToken(req, user._id),
            };
        });
    }
    login(req, loginUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserByEmail(loginUserDto.email);
            this.isUserBlocked(user);
            yield this.checkPassword(loginUserDto.password, user);
            yield this.passwordsAreMatch(user);
            return {
                fullName: user.fullName,
                email: user.email,
                accessToken: yield this.authService.createAccessToken(user._id),
                refreshToken: yield this.authService.createRefreshToken(req, user._id),
            };
        });
    }
    refreshAccessToken(refreshAccessTokenDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.authService.findRefreshToken(refreshAccessTokenDto.refreshToken);
            const user = yield this.userModel.findById(userId);
            if (!user) {
                throw new common_1.BadRequestException("Bad request");
            }
            return {
                accessToken: yield this.authService.createAccessToken(user._id),
            };
        });
    }
    forgotPassword(req, createForgotPasswordDto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findByEmail(createForgotPasswordDto.email);
            const verificationToken = yield this.saveForgotPassword(req, createForgotPasswordDto);
            yield this.sendEmailForgotPassword(createForgotPasswordDto.email, verificationToken);
            return {
                email: createForgotPasswordDto.email,
                message: "verification sent.",
            };
        });
    }
    forgotPasswordVerify(req, verifyUuidDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const forgotPassword = yield this.findForgotPasswordByUuid(verifyUuidDto);
            yield this.setForgotPasswordFirstUsed(req, forgotPassword);
            new Date().toDateString();
            return {
                email: forgotPassword.email,
                forgotPassword,
                message: "now reset your password.",
            };
        });
    }
    resetPassword(resetPasswordDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const forgotPassword = yield this.findForgotPasswordByEmail(resetPasswordDto);
            yield this.setForgotPasswordFinalUsed(forgotPassword);
            yield this.resetUserPassword(resetPasswordDto);
            return {
                email: resetPasswordDto.email,
                message: "password successfully changed.",
            };
        });
    }
    getAll(user, assigned, findAllDto, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filters, page, perPage, searchTerm, showCols, sortBy } = findAllDto;
            const skip = (page - 1) * perPage;
            const subordinates = yield this.getSubordinates(user, organization);
            const result = yield this.userModel.aggregate([
                { $match: { email: { $in: subordinates }, organization } },
                {
                    $lookup: {
                        from: "users",
                        localField: "email",
                        foreignField: "manages",
                        as: "managedBy",
                    },
                },
                { $unwind: "$managedBy" },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            { $addFields: { page: Number(page) } },
                        ],
                        users: [{ $skip: skip }, { $limit: perPage }],
                    },
                },
            ]);
            return { users: result[0].users, metadata: result[0].metadata[0] };
        });
    }
    getSubordinates(user, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.roleType === 'admin') {
                const users = yield this.userModel.find({ organization }, { email: 1, _id: 0 });
                return users.map(u => u.email);
            }
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
                        as: "subordinates",
                    },
                },
                {
                    $project: {
                        subordinates: "$subordinates.email",
                        roleType: "$roleType",
                        hierarchyWeight: 1,
                    },
                },
            ];
            const result = yield this.userModel.aggregate(fq);
            return result[0].subordinates;
        });
    }
    isEmailUnique(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({ email, verified: true });
            if (user) {
                throw new common_1.BadRequestException("Email most be unique.");
            }
        });
    }
    setRegistrationInfo(user) {
        user.verification = uuid_1.v4();
        user.verificationExpires = date_fns_1.addHours(new Date(), this.HOURS_TO_VERIFY);
    }
    buildRegistrationInfo(user) {
        const userRegistrationInfo = {
            fullName: user.fullName,
            email: user.email,
            verified: user.verified,
        };
        return userRegistrationInfo;
    }
    findByVerification(verification) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({
                verification,
                verified: false,
                verificationExpires: { $gt: new Date() },
            });
            if (!user) {
                throw new common_1.BadRequestException("Bad request.");
            }
            return user;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({ email, verified: true });
            if (!user) {
                throw new common_1.NotFoundException("Email not found.");
            }
            return user;
        });
    }
    setUserAsVerified(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.verified = true;
            yield user.save();
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({ email, verified: true });
            if (!user) {
                throw new common_1.NotFoundException("Wrong email or password.");
            }
            return user;
        });
    }
    checkPassword(attemptPass, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const match = yield bcrypt.compare(attemptPass, user.password);
            if (!match) {
                yield this.passwordsDoNotMatch(user);
                throw new common_1.NotFoundException("Wrong email or password.");
            }
            return match;
        });
    }
    isUserBlocked(user) {
        if (user.blockExpires > Date.now()) {
            throw new common_1.ConflictException("User has been blocked try later.");
        }
    }
    passwordsDoNotMatch(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.loginAttempts += 1;
            yield user.save();
            if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
                yield this.blockUser(user);
                throw new common_1.ConflictException("User blocked.");
            }
        });
    }
    blockUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.blockExpires = date_fns_1.addHours(new Date(), this.HOURS_TO_BLOCK);
            yield user.save();
        });
    }
    passwordsAreMatch(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.loginAttempts = 0;
            yield user.save();
        });
    }
    saveForgotPassword(req, createForgotPasswordDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const verificationToken = uuid_1.v4();
            const forgotPassword = yield new this.forgotPasswordModel({
                country: this.authService.getCountry(req),
                email: createForgotPasswordDto.email,
                verification: verificationToken,
                ip: this.authService.getIp(req),
                browser: this.authService.getBrowserInfo(req),
                expires: date_fns_1.addHours(new Date(), this.HOURS_TO_VERIFY),
            });
            yield forgotPassword.save();
            return verificationToken;
        });
    }
    findForgotPasswordByUuid(verifyUuidDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const forgotPassword = yield this.forgotPasswordModel.findOne({
                verification: verifyUuidDto.verification,
                firstUsed: false,
                finalUsed: false,
                expires: { $gt: new Date() },
            });
            if (!forgotPassword) {
                throw new common_1.BadRequestException("Bad request.");
            }
            return forgotPassword;
        });
    }
    setForgotPasswordFirstUsed(req, forgotPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            forgotPassword.firstUsed = true;
            forgotPassword.ipChanged = this.authService.getIp(req);
            forgotPassword.browserChanged = this.authService.getBrowserInfo(req);
            forgotPassword.countryChanged = this.authService.getCountry(req);
            yield forgotPassword.save();
        });
    }
    findForgotPasswordByEmail(resetPasswordDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const forgotPassword = yield this.forgotPasswordModel.findOne({
                email: resetPasswordDto.email,
                firstUsed: true,
                finalUsed: false,
                expires: { $gt: new Date() },
            });
            if (!forgotPassword) {
                throw new common_1.BadRequestException("Bad request.");
            }
            return forgotPassword;
        });
    }
    setForgotPasswordFinalUsed(forgotPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            forgotPassword.finalUsed = true;
            yield forgotPassword.save();
        });
    }
    resetUserPassword(resetPasswordDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({
                email: resetPasswordDto.email,
                verified: true,
            });
            user.password = resetPasswordDto.password;
            yield user.save();
        });
    }
    insertMany(activeUserId, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsonRes = parseExcel_1.default(filePath);
            const userid = mongoose_2.Types.ObjectId(activeUserId);
            let adminActions = new this.adminActionModel({
                userid,
                actionType: "upload",
                filePath,
                savedOn: "disk",
                fileType: "usersBulk",
            });
            yield adminActions.save();
            filePath = yield this.addNewUsers(jsonRes);
            adminActions = new this.adminActionModel({
                userid,
                actionType: "error",
                filePath,
                savedOn: "disk",
                fileType: "usersBulk",
            });
            return adminActions.save();
        });
    }
    addNewUsers(users) {
        return __awaiter(this, void 0, void 0, function* () {
            const erroredUsers = [];
            for (const u of users) {
                u.manages = this.parseManages(u);
                u.hierarchyWeight = this.assignHierarchyWeight(u);
                u.email = u.email.toLocaleLowerCase();
                let user = yield this.userModel.findOne({ email: u.email });
                let errorMessage = "";
                if (user) {
                    errorMessage = "Account with that email address already exists.";
                    erroredUsers.push(Object.assign(Object.assign({}, this.withManages(u)), { errorMessage }));
                    continue;
                }
                try {
                    user = new this.userModel(u);
                    yield user.save();
                }
                catch (e) {
                    erroredUsers.push(Object.assign(Object.assign({}, this.withManages(u)), { errorMessage }));
                }
            }
            return this.saveToExcel(erroredUsers);
        });
    }
    withManages(u) {
        u.manages = u.manages.join(",");
        return u;
    }
    parseManages(user) {
        if (!user.manages)
            return [];
        const manages = user.manages.replace(/\s/g, "").split(",");
        return manages;
    }
    assignHierarchyWeight(u) {
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
    }
    managersForReassignment(manages, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userModel
                .find({
                $and: [
                    { organization },
                    { email: { $in: manages } },
                    { roleType: { $ne: "frontline" } },
                ],
            }, { email: 1 })
                .lean()
                .exec();
        });
    }
    saveToExcel(json) {
        const filename = `users.xlsx`;
        const filePath = path_1.join(__dirname, "..", "..", "crm_response", filename);
        const created_ws = xlsx_1.utils.json_to_sheet(json);
        const wb = xlsx_1.utils.book_new();
        xlsx_1.utils.book_append_sheet(wb, created_ws, filename);
        xlsx_1.writeFile(wb, filePath);
        return filePath;
    }
    sendEmailForgotPassword(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var userFromDb = yield this.userModel.findOne({ email: email });
            if (!userFromDb)
                throw new common_1.HttpException("LOGIN.USER_NOT_FOUND", common_1.HttpStatus.NOT_FOUND);
            if (token) {
                let transporter = nodemailer_1.createTransport({
                    service: "Mailgun",
                    auth: {
                        user: config_1.default.mail.user,
                        pass: config_1.default.mail.pass,
                    },
                });
                let mailOptions = {
                    from: '"Company" <' + config_1.default.mail.user + ">",
                    to: [email],
                    subject: "Frogotten Password",
                    text: "Forgot Password",
                    html: forgot_password_template_1.getForgotPasswordTemplate(config_1.default.host.url, config_1.default.host.port, token),
                };
                var sended = yield new Promise(function (resolve, reject) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield transporter.sendMail(mailOptions, (error, info) => __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log("Message sent: %s", error);
                                return reject(false);
                            }
                            console.log("Message sent: %s", info.messageId);
                            resolve(true);
                        }));
                    });
                });
                return sended;
            }
            else {
                throw new common_1.HttpException("REGISTER.USER_NOT_REGISTERED", common_1.HttpStatus.FORBIDDEN);
            }
        });
    }
    getAllUsersHack(organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = 1, perPage = 20, skip = 0;
            return this.userModel
                .aggregate([
                {
                    $match: { verified: true, organization },
                },
                {
                    $project: { email: 1, fullName: 1 },
                },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            { $addFields: { page: Number(page) } },
                        ],
                        users: [{ $skip: skip }, { $limit: perPage }],
                    },
                },
            ])
                .exec();
        });
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("User")),
    __param(1, mongoose_1.InjectModel("ForgotPassword")),
    __param(2, mongoose_1.InjectModel("AdminAction")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        auth_service_1.AuthService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map