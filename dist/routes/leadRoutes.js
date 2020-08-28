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
const leadController = __importStar(require("../controllers/lead"));
const passportConfig = __importStar(require("../config/passport"));
const multerOpts_1 = require("../util/multerOpts");
const router = express_1.default.Router();
router.post("/findAll", passportConfig.authenticateJWT, leadController.findAll);
/** client should send the file in multi part form data and the name of the file dom element should be file
 * there should only be one file being sent, otherwise multer will send back an error to the client..
 */
router.post("/", passportConfig.authenticateJWT, leadController.insertOne);
router.post("/geolocation", passportConfig.authenticateJWT, leadController.addGeolocation);
router.put("/:externalId", passportConfig.authenticateJWT, leadController.updateLead);
router.post("/reassignLead", passportConfig.authenticateJWT, leadController.reassignLead);
router.post("/syncPhoneCalls", passportConfig.authenticateJWT, leadController.syncPhoneCalls);
router.get("/getLeadHistoryById/:externalId", passportConfig.authenticateJWT, leadController.getLeadHistoryById);
router.get("/fetchNextLead/:campaignId/:leadStatus", passportConfig.authenticateJWT, leadController.fetchNextLead);
router.get("/getAllLeadColumns", leadController.getAllLeadColumns);
router.get("/getLeadReassignmentHistory", passportConfig.authenticateJWT, leadController.getLeadReassignmentHistory);
router.get("/user/performance", passportConfig.authenticateJWT, leadController.getPerformance);
router.get("/basicOverview", leadController.getBasicOverview);
router.get("/getAllEmailTemplates", passportConfig.authenticateJWT, leadController.getAllEmailTemplates);
router.post("/createEmailTemplate", passportConfig.authenticateJWT, leadController.createEmailTemplate);
router.post("/bulkEmail", passportConfig.authenticateJWT, leadController.sendBulkEmails);
router.post("/uploadMultipleLeadFiles", passportConfig.authenticateJWT, multerOpts_1.upload.array("files[]"), leadController.uploadMultipleLeadFiles);
router.post("/saveAttachments", passportConfig.authenticateJWT, multerOpts_1.upload.array("files[]"), leadController.saveEmailAttachments);
router.get("/suggest/:leadId", passportConfig.authenticateJWT, leadController.suggestLeads);
router.get("/:leadId", leadController.findOneById);
router.patch("/:leadId", leadController.patch);
router.delete("/:leadId", leadController.deleteOne);
exports.default = router;
//# sourceMappingURL=leadRoutes.js.map