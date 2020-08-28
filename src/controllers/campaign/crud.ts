import { NextFunction, Request, Response } from "express";
import Campaign from "../../models/Campaign";
import {RedisContainer} from '../../starter/redis-container';
export const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, perPage = 20, filters={}, sortBy = "handler" } = req.body;

    const limit = Number(perPage);
    const skip = Number((page - 1) * limit);

    const { createdBy, campaigns = [] } = filters;


    const matchQ = {} as any;

    matchQ.$and = [];
    if(createdBy) {
        matchQ.$and.push({createdBy:createdBy});
    }

    if(campaigns && campaigns.length > 0) {
        matchQ.$and.push({ type: { $in: campaigns } });
    }

    const fq = [
        { $match: matchQ },
        { $sort: { [sortBy]: 1 } },
        {
            '$facet': {
                metadata: [ { $count: "total" }, { $addFields: { page: Number(page) } } ],
                data: [ { $skip: skip }, { $limit: limit } ] // add projection here wish you re-shape the docs
            }
        }
    ];

    if(fq[0]["$match"]["$and"].length === 0) {
        delete fq[0]["$match"]["$and"];
    }
    console.log(JSON.stringify(fq));
    const result = await Campaign.aggregate(fq);
    res.status(200).json({ data: result[0].data, metadata: result[0].metadata[0] });
};

export const findOneByIdOrName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.campaignId;
        const { identifier } = req.query;
        const redisClient = RedisContainer.getClient();
        
        const cachedCampaign = JSON.parse(await redisClient.get(id));
        if (cachedCampaign) {
            return res.status(200).send(cachedCampaign)
        }

        let result;
        switch (identifier) {
            case 'campaignName':
                result = await Campaign.findOne({ campaignName: id }).lean().exec();
                break;
            default:
                result = await Campaign.findById(id).lean().exec();
        }
        redisClient.set(id, JSON.stringify(result));
        return res.status(200).json(result);
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ error: e.message });
    }
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
};
