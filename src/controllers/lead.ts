/** https://www.youtube.com/watch?v=srPXMt1Q0nY&t=477s */ 
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Lead from "../models/lead";
import { leadMeta } from "../renames/lead";
import parseExcel from "../util/parseExcel";

export const findAll = (req: Request, res: Response, next: NextFunction) => {
    Lead.find()
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
                            url: "http://localhost:3000/lead/" + doc._id
                        }
                    };
                })
            };
            //   if (docs.length >= 0) {
            res.status(200).json(response);
            //   } else {
            //       res.status(404).json({
            //           message: 'No entries found'
            //       });
            //   }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};



export const insertOne = (req: Request, res: Response, next: NextFunction) => {
    console.log("printing ", req.body);
    const lead = new Lead({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    parseExcel(req.file.path, leadMeta());
    lead
        .save()
        .then((result: any) => {
            res.status(201).json({
                message: "Created lead successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/lead/" + result._id
                    }
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

export const findOneById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.productId;
    Lead.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    lead: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/lead"
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
    Lead.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Lead updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/lead/" + id
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
    Lead.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Lead deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/lead",
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