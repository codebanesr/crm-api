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
const agentController = __importStar(require("../controllers/agent"));
const passportConfig = __importStar(require("../config/passport"));
const multerOpts_1 = require("../util/multerOpts");
const router = express_1.default.Router();
router.post("/many", passportConfig.authenticateJWT, multerOpts_1.upload.single("file"), agentController.insertMany);
router.get("/listActions", passportConfig.authenticateJWT, agentController.listActions);
router.get("/download", passportConfig.authenticateJWT, agentController.downloadFile);
exports.default = router;
//# sourceMappingURL=agentRoutes.js.map