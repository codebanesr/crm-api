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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
const bcrypt = require("bcryptjs");
exports.UserSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        minlength: 6,
        maxlength: 255,
        required: [true, "NAME_IS_BLANK"],
    },
    email: {
        type: String,
        lowercase: true,
        validate: validator_1.default.isEmail,
        maxlength: 255,
        minlength: 6,
        required: [true, "EMAIL_IS_BLANK"],
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: [true, "PASSWORD_IS_BLANK"],
    },
    roles: {
        type: [String],
        default: ["user"],
    },
    verification: {
        type: String,
        validate: validator_1.default.isUUID,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationExpires: {
        type: Date,
        default: Date.now,
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    blockExpires: {
        type: Date,
        default: Date.now,
    },
    roleType: { type: String, required: true },
    manages: [String],
    reportsTo: { type: String, default: null },
    phoneNumber: { type: String, required: true, default: "00000" },
    history: { type: Array, default: null },
    hierarchyWeight: Number,
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Organization",
        default: null,
    },
    pushtoken: {
        endpoint: String,
        expirationTime: String,
        keys: {
            p256dh: String,
            auth: String,
        },
    },
    batLvl: Number
}, {
    versionKey: false,
    timestamps: true,
});
exports.UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!this.isModified("password")) {
                return next();
            }
            const hashed = yield bcrypt.hash(this["password"], 10);
            this["password"] = hashed;
            return next();
        }
        catch (err) {
            return next(err);
        }
    });
});
//# sourceMappingURL=user.schema.js.map