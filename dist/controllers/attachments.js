"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const attachments_1 = __importDefault(require("../models/attachments"));
const fs = __importStar(require("fs"));
exports.uploadFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.query, { type: category } = _a, others = __rest(_a, ["type"]);
    try {
        const filename = req.file.filename;
        const filepath = req.file.path;
        const attachment = new attachments_1.default({ filename: filename, path: filepath });
        const result = yield attachment.save();
        res.status(200).json({ success: true, result });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "An Error Occured while parsing the file" });
    }
});
exports.getAllFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _b = req.query, { type: category } = _b, others = __rest(_b, ["type"]);
    try {
        const files = yield attachments_1.default.find();
        return res.status(200).json(files);
    }
    catch (e) {
        res.status(500).json({ success: false, message: "An Error Occured while parsing the file" });
    }
});
exports.getBlobByPath = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var readStream = fs.createReadStream(req.query.filename);
    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        readStream.pipe(res);
    });
    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', function (err) {
        res.end(err);
    });
});
//# sourceMappingURL=attachments.js.map