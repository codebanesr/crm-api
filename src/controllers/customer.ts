/** https://www.youtube.com/watch?v=srPXMt1Q0nY&t=477s */ 
import { NextFunction, Request, Response } from "express";
import Customer from "../models/customer";
import AdminAction from "../models/AdminAction";
import parseExcel from "../util/parseExcel";
import mongoose from "mongoose";
import Lead from "../models/lead";
import Ticket from "../models/ticket";
import Campaign from "../models/Campaign";
import CampaignConfig from "../models/CampaignConfig";
import XLSX from "xlsx";
import * as fs from "fs";

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
    const { type: category, ...others } = req.query;
    const userid = (req.user as Express.User & {id: string}).id;
    const jsonRes = parseExcel(req.file.path);
    handleBulkUploads(jsonRes, category, others);
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
const handleBulkUploads = (jsonRes: any, category: string, others: any) => {
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
            case "campaignSchema":
                saveCampaignSchema(jsonRes, others);
                break;
            default:
                console.log("The query param doesnot match a valid value", category);
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
    const created = [];
    const updated = [];
    const error = []
    
    for(let t of tickets) {
        const { lastErrorObject, value } = await Ticket.findOneAndUpdate({ leadId: t.leadId }, t, { new: true, upsert: true, rawResult: true }).lean().exec();
        if(lastErrorObject.updatedExisting === true) {
            updated.push(value);
        }else if(lastErrorObject.upserted) {
            created.push(value);
        }else{
            error.push(value)
        }
    }

    // createExcel files and update them to aws and then store the urls in database with AdminActions
    const created_ws = XLSX.utils.json_to_sheet(created);
    const updated_ws = XLSX.utils.json_to_sheet(updated);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, updated_ws, "tickets updated");
    XLSX.utils.book_append_sheet(wb, created_ws, "tickets created");

    XLSX.writeFile(wb, "sheetjs.xlsx");
    console.log("created: ",created.length, "updated: ",updated.length, "error:", error.length);
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


const saveCampaignSchema = async(ccJSON: any[], others: any) => {
    const created = [];
    const updated = [];
    const error = []
    
    for(let cc of ccJSON) {
        const { lastErrorObject, value } = await CampaignConfig.findOneAndUpdate(
            { name: others.schemaName, internalField: cc.internalField }, 
            cc, 
            { new: true, upsert: true, rawResult: true }
        ).lean().exec();
        if(lastErrorObject.updatedExisting === true) {
            updated.push(value);
        }else if(lastErrorObject.upserted) {
            created.push(value);
        }else{
            error.push(value)
        }
    }

    // createExcel files and update them to aws and then store the urls in database with AdminActions
    const created_ws = XLSX.utils.json_to_sheet(created);
    const updated_ws = XLSX.utils.json_to_sheet(updated);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, updated_ws, "tickets updated");
    XLSX.utils.book_append_sheet(wb, created_ws, "tickets created");

    XLSX.writeFile(wb, "sheetjs.xlsx");
    console.log("created: ",created.length, "updated: ",updated.length, "error:", error.length);
}