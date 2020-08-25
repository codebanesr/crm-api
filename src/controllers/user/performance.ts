import { NextFunction, Response } from "express";
import { AuthReq } from "../../interface/authorizedReq";
import Lead from '../../models/lead';
export const leadActivity = async (req: AuthReq, res: Response, next:NextFunction) => {
    const { id } = req.user;
    const query = Lead.aggregate();


    return res.status(200).send({ token: 123 });
}   