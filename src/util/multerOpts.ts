import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
// import os from "os";

// const UPLOAD_DIR = path.join(os.homedir(), "uploads");
export const PUBLIC_UPLOADS_DIR = path.join(__dirname, "../uploads");

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
            console.log("creating upload folder recursively and making it public");
            fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true, mode: 0o777 });
        }
        cb(null, PUBLIC_UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

/** @Todo define strict typings for file and cb */
export const fileFilter = (req: Request, file: any, cb: any) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
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


/** Can be used for if we dont want to push values to a different plugggable directory */
// (function makedir() {
//     console.log("makerid function called! checking for existence of upload folder")
//     if(!fs.existsSync(UPLOAD_DIR)) {
//         console.log("creating upload folder recursively and making it public")
//         fs.mkdirSync(UPLOAD_DIR, { recursive: true, mode: 0o777 });
//     }
// })();