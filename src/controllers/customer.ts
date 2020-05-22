/** https://www.youtube.com/watch?v=srPXMt1Q0nY&t=477s */ 
import { NextFunction, Request, Response } from "express";
import Customer from "../models/customer";
import AdminAction from "../models/AdminAction";
import parseExcel from "../util/parseExcel";
import logger from "../util/logger";
import mongoose from "mongoose";

export const findAll = (req: Request, res: Response, next: NextFunction) => {
    Customer.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map((doc: any) => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/product/" + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};



export const insertMany = async(req: Request, res: Response, next: NextFunction) => {
    const userid = (req.user as any).id;
    const jsonRes = parseExcel(req.file.path);

    const lead = new AdminAction({
        userid: mongoose.Types.ObjectId(userid),
        actionType: "upload",
        filePath: req.file.path,
        savedOn: "disk",
        fileType: "customerBulk"
    });

    try {
        const result = await lead.save();
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
};


