"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const dotenv_1 = require("dotenv");
if (!process.env.NODE_ENV) {
    const p = path.resolve(__dirname, "../..", "env", "local.env");
    dotenv_1.config({ path: p });
}
exports.default = {
    razorpay: {
        username: process.env.RAZORPAY_USERNAME,
        password: process.env.RAZORPAY_PASSWORD,
        secret: process.env.RAZORPAY_SECRET,
    },
    s3: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
        region: process.env.region,
    },
    db: {
        user: null,
        pass: null,
        host: "localhost",
        port: "27017",
        database: "testdb",
        authSource: null,
    },
    MONGODB_URI: process.env.MONGODB_URI,
    host: {
        address: process.env.CRM_ADDRESS
    },
    jwt: {
        secretOrKey: "secret",
        expiresIn: 36000000,
    },
    mail: {
        host: "smtp.mailgun.org",
        port: "587",
        secure: false,
        user: "postmaster@sandboxa1696d63603146bca752bd634e4392b0.mailgun.org",
        pass: "cced296ef54947e7b40028014a04ae2a-0f472795-9d8efe34",
    },
    twilio: {
        accountSid: "AC3096988c610ab3d5b05e430650af8e58",
        authToken: "a11a998f8ac16b5fb04007cbb123cc44",
        mobileNumber: "+19402203638",
    },
    redisOpts: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT) || 6379,
        db: parseInt(process.env.REDIS_DB) || 4,
        password: process.env.REDIS_PASSWORD || "password123",
    },
    webpush: {
        VAPID_PUBLIC: process.env.VAPID_PUBLIC,
        VAPID_PRIVATE: process.env.VAPID_PRIVATE,
    },
    BULL: {
        REDIS_PASSWORD: process.env.BULL_REDIS_PASSWORD,
        REDIS_URL: process.env.BULL_REDIS_URL,
        REDIS_PORT: process.env.BULL_REDIS_PORT,
    },
    oauth: {
        google: {
            clientId: process.env.GOOGLE_OAUTH_CLIENTID
        }
    },
    ses: {
        "region": "email-smtp.ap-south-1.amazonaws.com",
        "username": "AKIASJF5UAUY55LYUDGC",
        "password": "BN7HKD4ukXuOYFjhj6cHtRYKmFJma2a5M+KxZn8lCRT7",
        "supportEmail": "support@applesauce.co.in",
        "notificationEmail": "notification@applesauce.co.in",
        "onboarding": "onboarding@applesauce.co.in",
        "customerReplyEmail": "shanur.cse.nitap@gmail.com"
    }
};
//# sourceMappingURL=config.js.map