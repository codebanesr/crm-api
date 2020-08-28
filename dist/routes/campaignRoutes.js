"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaignController = __importStar(require("../controllers/campaign"));
const passportConfig = __importStar(require("../config/passport"));
const multerOpts_1 = require("../util/multerOpts");
const router = express_1.default.Router();
router.post("/get", campaignController.findAll);
router.get("/disposition/:campaignId", passportConfig.authenticateJWT, campaignController.getDispositionForCampaign);
router.get("/autocomplete/suggestEmails", campaignController.getHandlerEmailHints);
router.get("/autocomplete/suggestTypes", campaignController.getCampaignTypes);
router.post("/config/upload", passportConfig.authenticateJWT, multerOpts_1.upload.single("file"), campaignController.uploadConfig);
router.get("/:campaignId", campaignController.findOneByIdOrName);
router.patch("/:campaignId", campaignController.patch);
router.delete("/:campaignId", campaignController.deleteOne);
router.post("/createCampaignAndDisposition", passportConfig.authenticateJWT, multerOpts_1.upload.single("campaignFile"), campaignController.createCampaignAndDisposition);
router.get("campaign/:na");
exports.default = router;
//# sourceMappingURL=campaignRoutes.js.map