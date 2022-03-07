declare const _default: {
    razorpay: {
        username: string;
        password: string;
        secret: string;
    };
    s3: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
    };
    db: {
        user: any;
        pass: any;
        host: string;
        port: string;
        database: string;
        authSource: any;
    };
    MONGODB_URI: string;
    host: {
        address: string;
    };
    jwt: {
        secretOrKey: string;
        expiresIn: number;
    };
    mail: {
        host: string;
        port: string;
        secure: boolean;
        user: string;
        pass: string;
    };
    twilio: {
        accountSid: string;
        authToken: string;
        mobileNumber: string;
    };
    redisOpts: {
        host: string;
        port: number;
        db: number;
        password: string;
    };
    webpush: {
        VAPID_PUBLIC: string;
        VAPID_PRIVATE: string;
    };
    BULL: {
        REDIS_PASSWORD: string;
        REDIS_URL: string;
        REDIS_PORT: string;
    };
    oauth: {
        google: {
            clientId: string;
        };
    };
    ses: {
        region: string;
        username: string;
        password: string;
        supportEmail: string;
        notificationEmail: string;
        onboarding: string;
        customerReplyEmail: string;
    };
};
export default _default;
