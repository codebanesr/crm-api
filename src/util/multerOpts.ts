import { Request } from "express";
import multer from "multer";
import os from "os";
import path from "path"


/** @Todo try creating a folder in users home directory like $HOME/uploads and store files there 
 * unless you want to serve all these files publically which we are doing, what i dont know is where
 * is this folder going to be created, which is how does path resolution take place. Does it take
 * this directory to resolve relative routes or does it take the directory in which this code gets 
 * executed
 */
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(os.homedir(), "rhb_public"));
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

/** @Todo define strict typings for file and cb */
export const fileFilter = (req: Request, file: any, cb: any) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter
});
