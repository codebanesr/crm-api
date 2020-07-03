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
const Agent_1 = __importDefault(require("../models/Agent"));
const AdminAction_1 = __importDefault(require("../models/AdminAction"));
const mongoose_1 = __importDefault(require("mongoose"));
const parseExcel_1 = __importDefault(require("../util/parseExcel"));
const fs = __importStar(require("fs"));
// import agentValidator from '../validator/agent';
exports.insertMany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.id;
    const jsonRes = parseExcel_1.default(req.file.path);
    const adminActions = new AdminAction_1.default({
        userid: mongoose_1.default.Types.ObjectId(userid),
        actionType: "upload",
        filePath: req.file.path,
        savedOn: "disk",
        fileType: "agentBulk",
    });
    yield saveAgents(jsonRes); //this will send uploaded path to the worker, or aws s3 location
    try {
        const result = yield adminActions.save();
        res
            .status(200)
            .json({
            success: true,
            filePath: req.file.path,
            message: "successfully parsed file",
        });
    }
    catch (e) {
        res
            .status(500)
            .json({
            success: false,
            message: "An Error Occured while parsing the file",
        });
    }
});
const saveAgents = (agents) => __awaiter(void 0, void 0, void 0, function* () {
    // validateAgents(agents);
    const defaults = { createdAt: Date.now(), updatedAt: Date.now() };
    let bulk = Agent_1.default.collection.initializeUnorderedBulkOp();
    let c = 0;
    for (let a of agents) {
        c++;
        bulk
            .find({ email: a.email })
            .upsert()
            .updateOne(Object.assign(Object.assign({}, a), defaults));
        if (c % 1000 === 0) {
            bulk.execute((err, res) => {
                console.log("Finished iteration ", c % 1000, err, res);
                bulk = Agent_1.default.collection.initializeUnorderedBulkOp();
            });
        }
    }
    if (c % 1000 !== 0)
        bulk.execute((err, res) => {
            console.log("Finished iteration ", c % 1000, err, JSON.stringify(res));
        });
});
// const validateAgents = (data: any) => {
//     const { valid, validate } = agentValidator(data);
//     if (!valid) {
//         validate.errors.forEach(error =>{
//             const {message, data, dataPath} = error;
//             console.log(message, data, dataPath);
//         })
//     }else{
//         console.log("no errors")
//     }
// }
exports.listActions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, fileType, sortBy = "handler", me } = req.query;
    const userid = req.user.id;
    const matchQ = {};
    if (fileType) {
        matchQ.fileType = fileType;
    }
    if (me) {
        matchQ.userid = new mongoose_1.default.Types.ObjectId(req.user.id);
    }
    const fq = [
        { $match: matchQ },
        {
            $lookup: {
                from: "users",
                localField: "userid",
                foreignField: "_id",
                as: "userdetails",
            },
        },
        {
            $unwind: { path: "$userdetails" },
        },
        {
            $project: {
                email: "$userdetails.email",
                savedOn: "$userdetails.savedOn",
                filePath: "$filePath",
                actionType: "$actionType",
                createdAt: "$createdAt",
            },
        },
        { $sort: { createdAt: -1 } },
        { $skip: Number(skip) },
        {
            $limit: 10,
        },
    ];
    console.log(fq);
    const result = yield AdminAction_1.default.aggregate(fq);
    res.status(200).json(result);
});
exports.downloadFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { location } = req.query;
    let readStream = fs.createReadStream(location);
    readStream.on('close', () => {
        res.end();
    });
    readStream.pipe(res);
});
//# sourceMappingURL=agent.js.map