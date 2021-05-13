export interface AuthReq extends Request {
    user: {
        id: string;
        email: string;
        manages: string[];
    };
    files: any;
}
