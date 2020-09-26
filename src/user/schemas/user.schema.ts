import { Schema, HookNextFunction } from "mongoose";
import validator from "validator";
import * as bcrypt from "bcryptjs";

export const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: [true, "NAME_IS_BLANK"],
    },
    email: {
      type: String,
      lowercase: true,
      validate: validator.isEmail,
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
      validate: validator.isUUID,
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
    
    /**@todo this default has to be removed */
    phoneNumber: { type: String, required: true, default: "00000" },
    history: { type: Array, default: null },
    hierarchyWeight: Number,
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next: HookNextFunction) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    // tslint:disable-next-line:no-string-literal
    const hashed = await bcrypt.hash(this["password"], 10);
    // tslint:disable-next-line:no-string-literal
    this["password"] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
