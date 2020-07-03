"use strict";
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
const express_1 = __importDefault(require("express"));
const attachmentController = __importStar(require("../controllers/attachments"));
const passportConfig = __importStar(require("../config/passport"));
const multerOpts_1 = require("../util/multerOpts");
const router = express_1.default.Router();
router.get("/getAllFiles", passportConfig.authenticateJWT, attachmentController.getAllFiles);
router.post("/uploadFile", passportConfig.authenticateJWT, multerOpts_1.upload.single("file"), attachmentController.uploadFile);
exports.default = router;
//# sourceMappingURL=attachmentRoutes.js.map