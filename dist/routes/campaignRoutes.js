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
const campaignController = __importStar(require("../controllers/campaign"));
const passportConfig = __importStar(require("../config/passport"));
const multerOpts_1 = require("../util/multerOpts");
const router = express_1.default.Router();
router.post("/get", campaignController.findAll);
router.get("/disposition/:id", passportConfig.authenticateJWT, campaignController.getDispositionForCampaign);
router.get("/autocomplete/suggestEmails", campaignController.getHandlerEmailHints);
router.get("/autocomplete/suggestTypes", campaignController.getCampaignTypes);
router.post("/config/upload", passportConfig.authenticateJWT, multerOpts_1.upload.single("file"), campaignController.uploadConfig);
router.get("/:campaignId", campaignController.findOneById);
router.patch("/:campaignId", campaignController.patch);
router.delete("/:campaignId", campaignController.deleteOne);
exports.default = router;
//# sourceMappingURL=campaignRoutes.js.map