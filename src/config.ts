import { config as loadEnvConfig } from "dotenv";

loadEnvConfig();

export default {
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
    url: "localhost",
    port: "3000",
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
    // keyPrefix: process.env.REDIS_PRIFIX,
  },

  webpush: {
    VAPID_PUBLIC: process.env.VAPID_PUBLIC,
    VAPID_PRIVATE: process.env.VAPID_PRIVATE,
  },

  BULL: {
    REDIS_PASSWORD: process.env.BULL_REDIS_PASSWORD,
    REDIS_URL: process.env.BULL_REDIS_URL,
    REDIS_PORT: process.env.BULL_REDIS_PORT,
  }
};
