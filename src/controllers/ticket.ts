/** https://www.youtube.com/watch?v=srPXMt1Q0nY&t=477s */ 
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Ticket from "../models/ticket";
import logger from "../util/logger";

export const findAll = async(req: Request, res: Response, next: NextFunction) => {
    const { page, perPage, sortBy='createdAt' } = req.query;

    const limit = Number(perPage);
    const skip = Number((page-1)*limit);
    const result = await Ticket.aggregate([
        {$match: {}},
        {$sort: {[sortBy]: 1}},
        {$skip: skip},
        {$limit: limit}
    ]);
    res.status(200).json(result);
};

const createTicketFromForm = (req: Request) => {
    return {
        "leadId": req.body.leadId,
        "createdBy": (req.user as any).id,
        "changeHistory": {changeType: "Created", by: (req.user as any).id, to: ""},
        "customer": {
            "email": req.body.email,
            "phoneNumberPrefix": req.body.phoneNumberPrefix,
            "phoneNumber": req.body.phoneNumber,
            "name": req.body.nickname,
        },
        "assignedTo": req.body.assignedTo,
        "followUp": req.body.followUp,
        "agree": req.body.agree,
        "status": req.body.status
    }
}

export const insertOne = async(req: Request, res: Response, next: NextFunction) => {
    console.log("printing ", req.body);
    let ticketObj = createTicketFromForm(req);
    const ticket = new Ticket({
        ...ticketObj,
        _id: new mongoose.Types.ObjectId()
    })

    const result = await ticket.save();

    return res.status(200).json(result);
};

export const findOneById = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const id = mongoose.Types.ObjectId(req.params.ticketId);
        const result = await Ticket.findById(id);
        return res.status(200).json(result);
    }catch(error) {
        return res.status(500).send(`An error occured, ${error.message}`)
    }
};


export const put = async(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.ticketId;
    const ticket = createTicketFromForm(req);
    const result = await Ticket.update({ _id: id }, { $set: ticket });

    return res.status(200).json(result);
};



export const suggestTickets = async(req: Request, res: Response, next: NextFunction) => {
    const { leadId } = req.params;

    const query = [
        {
            $match: {
                leadId: {$regex: `^${leadId}`}
            }
        },
        { $project : { leadId : 1} },
        { $limit: 10 }
    ];

    const result = await Ticket.aggregate(query);

    return res.status(200).json(result);
}


export const findByLeadId = async(req: Request, res: Response, next: NextFunction) => {
    const lead = await Ticket.findOne({leadId: req.params.leadId}, {});
    return res.status(200).json(lead);
}

export const deleteOne = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.productId;
    Ticket.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Ticket deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/ticket",
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