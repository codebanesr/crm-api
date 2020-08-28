"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.fileFilter = exports.storage = exports.PUBLIC_UPLOADS_DIR = void 0;
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// import os from "os";
// const UPLOAD_DIR = path.join(os.homedir(), "uploads");
exports.PUBLIC_UPLOADS_DIR = path_1.default.join(__dirname, "../uploads");
const PUBLIC_PERMISSION = 0o777;
exports.storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        if (!fs_1.default.existsSync(exports.PUBLIC_UPLOADS_DIR)) {
            console.log("creating upload folder recursively and making it public");
            fs_1.default.mkdirSync(exports.PUBLIC_UPLOADS_DIR, { recursive: true, mode: PUBLIC_PERMISSION });
        }
        cb(null, exports.PUBLIC_UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
/** @Todo define strict typings for file and cb */
exports.fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.upload = multer_1.default({
    storage: exports.storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});
/** Can be used for if we dont want to push values to a different plugggable directory */
// (function makedir() {
//     console.log("makerid function called! checking for existence of upload folder")
//     if(!fs.existsSync(UPLOAD_DIR)) {
//         console.log("creating upload folder recursively and making it public")
//         fs.mkdirSync(UPLOAD_DIR, { recursive: true, mode: 0o777 });
//     }
// })();
//# sourceMappingURL=multerOpts.js.map