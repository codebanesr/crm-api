/** https://www.youtube.com/watch?v=srPXMt1Q0nY&t=477s */
import { NextFunction, Request, Response } from "express";
import Alarm, {IAlarm} from "../../models/Alarm";

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, perPage = 20, filters={}, sortBy = 'createdAt' } = req.body;

    const limit = Number(perPage);
    const skip = Number((page - 1) * limit);


    const fq = [
        { $match: {} },
        { $sort: { [sortBy]: 1 } },
        { $skip: skip },
        { $limit: limit }
    ];

    console.log(JSON.stringify(fq));
    const result = await Alarm.aggregate(fq);
    res.status(200).json(result);
};

export const findOneById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.alarmId;
    Alarm.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/product"
                    }
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};


export const patch = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.alarmId;
    const updateOps: { [index: string]: any } = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Alarm.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Customer updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/product/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

export const deleteOne = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.alarmId;
    Alarm.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Customer deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/product",
                    body: { name: "String", price: "Number" }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}




export const createAlarm = async(alarmObj: IAlarm) => {
    const alarm = new Alarm(alarmObj);

    const result = await alarm.save();

    return result;
}

