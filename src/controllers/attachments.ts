import { NextFunction, Request, Response } from "express";
import Attachment from '../models/attachments';
import * as fs from "fs";

export const uploadFile = async(req: Request, res: Response, next: NextFunction) => {
    const { type: category, ...others } = req.query;
    
    try {
        const filename: string = req.file.filename;
        const filepath: string = req.file.path;

        const attachment = new Attachment({filename: filename, path: filepath});
        const result = await attachment.save();
        res.status(200).json({success: true, result});
    }catch(e) {
        res.status(500).json({success: false, message: "An Error Occured while parsing the file"});
    }
};




export const getAllFiles = async(req: Request, res: Response, next: NextFunction) => {
    const { type: category, ...others } = req.query;
    
    try {
        const files = await Attachment.find();
        return res.status(200).json(files);
    }catch(e) {
        res.status(500).json({success: false, message: "An Error Occured while parsing the file"});
    }
};


export const getBlobByPath = async(req:Request, res: Response, next: NextFunction) => {
    var readStream = fs.createReadStream(req.query.filename);

    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', function () {
      // This just pipes the read stream to the response object (which goes to the client)
      readStream.pipe(res);
    });
  
    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', function(err) {
      res.end(err);
    });
}