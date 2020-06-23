import { Request } from "express";

export interface AuthReq extends Request{
    user: {
        email: string;
        manages: string[];
    };
}