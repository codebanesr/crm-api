declare const _default: {
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
    host: {
        url: string;
        port: string;
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
};
export default _default;
