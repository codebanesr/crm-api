import { NextFunction, Response } from "express";
import { AuthReq } from "../../interface/authorizedReq";
import Lead from '../../models/lead';
export const leadActivityByUser = async (req: AuthReq, res: Response, next:NextFunction) => {
    const { email } = req.params;
    const { startDate, endDate } = req.query;
    
    const updatedAtQuery = getUpdatedAtQuery(startDate, endDate);
    const qb = Lead.aggregate();
    qb.match({
        email,
        ...updatedAtQuery
    });
    qb.group({
        _id: { leadStatus: "$leadStatus" },
        myCount: { $sum: 1 },
    });

    console.log(qb.pipeline())
    const result = await  qb.exec();
    return res.status(200).json(result);
}  



const getUpdatedAtQuery = (startDate: string, endDate: string) => {
    const uq = { "updatedAt": { "$gt": new Date("1000-01-01T00:00:00.000Z")  } } as any;
    if (startDate) {
        uq.updatedAt["$gt"] = new Date(startDate);
    }   

    if (endDate) {
        uq.updatedAt["$lt"] = new Date(endDate);
    }

    return uq;
}