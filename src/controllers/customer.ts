/** https://www.youtube.com/watch?v=srPXMt1Q0nY&t=477s */ 
import { NextFunction, Request, Response } from "express";
import Customer from "../models/customer";
import AdminAction from "../models/AdminAction";
import parseExcel from "../util/parseExcel";
import mongoose from "mongoose";
import Lead from "../models/lead";
import Ticket from "../models/ticket";
import ticketValidator from '../validator/ticket';
import Campaign from "../models/Campaign";

export const findAll = async(req: Request, res: Response, next: NextFunction) => {
    const { page, perPage, sortBy='createdAt' } = req.query;

    const limit = Number(perPage);
    const skip = Number((page-1)*limit);
    const result = await Customer.aggregate([
        {$match: {}},
        {$sort: {[sortBy]: 1}},
        {$skip: skip},
        {$limit: limit}
    ]);
    res.status(200).json(result);
};

export const insertMany = async(req: Request, res: Response, next: NextFunction) => {
    const { type: category } = req.query;
    const userid = (req.user as Express.User & {id: string}).id;
    const jsonRes = parseExcel(req.file.path);
    handleBulkUploads(jsonRes, category);
    const adminActions = new AdminAction({
        userid: mongoose.Types.ObjectId(userid),
        actionType: "upload",
        filePath: req.file.path,
        savedOn: "disk",
        fileType: category
    });

    try {
        const result = await adminActions.save();
        res.status(200).json({success: true, filePath: req.file.path, message: "successfully parsed file"});
    }catch(e) {
        res.status(500).json({success: false, message: "An Error Occured while parsing the file"});
    }
};

export const findOneById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.productId;
    Customer.findById(id)
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
    const id = req.params.productId;
    const updateOps: {[index: string]: any} = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Customer.update({ _id: id }, { $set: updateOps })
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
    const id = req.params.productId;
    Customer.remove({ _id: id })
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




/** This function should call a worker that will handle uploads, everything below this is to be pushed to worker 
 * similarly the validator folder also goes inside the worker ..., file upload also happens in aws, then we send the url 
 * to worker, the worker will then pick it up and execute
*/
const handleBulkUploads = (jsonRes: any, category: string) => {
    try {
        switch (category) {
            case "customer":
                saveCustomers(jsonRes);
                break;
            case "lead":
                saveLeads(jsonRes);
                break;
            case "ticket":
                saveTickets(jsonRes);
                break;

            case "campaign":
                saveCampaign(jsonRes);
                break;
            default:
                console.log("The query param doesnot match a valid value");
        }
    } catch (e) {
        console.log(e);
    }
}

/** Findone and update implementation */
const saveLeads = async(leads: any[]) => {
    let bulk = Lead.collection.initializeUnorderedBulkOp();
    let c = 0;
    for(let l of leads) {
        c++;
        bulk
            .find({_id: l._id})
            .upsert()
            .updateOne(l);
        if(c%1000 === 0){
            bulk.execute((err, res)=>{
                console.log("Finished iteration ", c%1000);
                bulk = Lead.collection.initializeUnorderedBulkOp();
            })
        }
    }
    if(c % 1000 !==0 )
        bulk.execute((err, res)=>{
            console.log("Finished iteration ", c%1000, err, res);
        })
}


const saveTickets = async(tickets: any[]) => {
    validateTickets(tickets);
    const defaults = {createdAt:Date.now(), updatedAt: Date.now()};
    let bulk = Ticket.collection.initializeUnorderedBulkOp();
    let c = 0;
    for(let t of tickets) {
        c++;
        bulk
            .find({leadId: t.leadId})
            .upsert()
            .updateOne({
                ...t,
                ...defaults
            });
        if(c%1000 === 0){
            bulk.execute((err, res)=>{
                console.log("Finished iteration ", c%1000, err, res);
                bulk = Lead.collection.initializeUnorderedBulkOp();
            })
        }
    }
    if(c % 1000 !==0 )
        bulk.execute((err, res)=>{
            console.log("Finished iteration ", c%1000, err, JSON.stringify(res));
        })
}


const validateTickets = (data: any) => {
    const { valid, validate } = ticketValidator(data);
    if (!valid) {
        validate.errors.forEach(error =>{
            const {message, data, dataPath} = error;
            console.log(message, data, dataPath);
        })
    }else{
        console.log("no errors")
    }
}




/** Findone and update implementation */
const saveCustomers = async(customers: any[]) => {
    let bulk = Customer.collection.initializeUnorderedBulkOp();
    let c = 0;
    for(let cu of customers) {
        c++;
        bulk
            .find({_id: cu._id})
            .upsert()
            .updateOne(cu);
        if(c%1000 === 0){
            bulk.execute((err, res)=>{
                console.log("Finished iteration ", c%1000);
                bulk = Customer.collection.initializeUnorderedBulkOp();
            })
        }
    }
    if(c % 1000 !==0 )
        bulk.execute((err, res)=>{
            console.log("Finished iteration ", c%1000, err, res);
        })
}



/** Findone and update implementation */
const saveCampaign = async(campaigns: any[]) => {
    let bulk = Campaign.collection.initializeUnorderedBulkOp();
    let c = 0;
    for(let ca of campaigns) {
        c++;
        bulk
            .find({handler: ca.handler})
            .upsert()
            .updateOne(ca);
        if(c%1000 === 0){
            bulk.execute((err, res)=>{
                console.log("Finished iteration ", c%1000);
                bulk = Campaign.collection.initializeUnorderedBulkOp();
            })
        }
    }
    if(c % 1000 !==0 )
        bulk.execute((err, res)=>{
            console.log("Finished iteration ", c%1000, err, res);
        })
}