/** https://www.youtube.com/watch?v=srPXMt1Q0nY&t=477s */
import { NextFunction, Request, Response } from "express";
import Campaign from "../models/Campaign";

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, perPage = 20, filters, sortBy = 'handler' } = req.query;

    const limit = Number(perPage);
    const skip = Number((page - 1) * limit);
    const result = await Campaign.aggregate([
        { $match: {} },
        { $sort: { [sortBy]: 1 } },
        { $skip: skip },
        { $limit: limit }
    ]);
    res.status(200).json(result);
};

export const findOneById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.campaignId;
    Campaign.findById(id)
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
    const id = req.params.campaignId;
    const updateOps: { [index: string]: any } = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Campaign.update({ _id: id }, { $set: updateOps })
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
    const id = req.params.campaignId;
    Campaign.remove({ _id: id })
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



export const getHandlerEmailHints = async(req: Request, res: Response, next: NextFunction) => {
    const limit = 15;
    const { partialEmail } = req.query;
    const result = await Campaign.aggregate([
        {
            $match: {
                handler: {$regex: `^${partialEmail}`}
            }
        },{
            $project: {handler: 1, _id:0}
        },
        { $limit: limit }
    ]);

    return res.status(200).send(result.map(r=>r.handler));
}


