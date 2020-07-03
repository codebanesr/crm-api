import express from "express";
import * as leadController from "../controllers/lead";
import * as passportConfig from "../config/passport";
import { upload } from "../util/multerOpts";

const router = express.Router();

router.post("/findAll", passportConfig.authenticateJWT, leadController.findAll);
/** client should send the file in multi part form data and the name of the file dom element should be file 
 * there should only be one file being sent, otherwise multer will send back an error to the client..
 */
router.post("/", passportConfig.authenticateJWT, leadController.insertOne);

router.post("/reassignLead", passportConfig.authenticateJWT, leadController.reassignLead);
router.get("/getLeadHistoryById/:externalId", passportConfig.authenticateJWT, leadController.getLeadHistoryById);

router.post("/bulkEmail", passportConfig.authenticateJWT, leadController.sendBulkEmails);

router.get("/getAllLeadColumns", leadController.getAllLeadColumns);

router.get("/getLeadReassignmentHistory",passportConfig.authenticateJWT, leadController.getLeadReassignmentHistory);

router.get("/basicOverview", leadController.getBasicOverview);

router.post("/createEmailTemplate", passportConfig.authenticateJWT, leadController.createEmailTemplate);
router.post("/saveAttachments", passportConfig.authenticateJWT, upload.array("files[]"), leadController.saveEmailAttachments);
router.get("/getAllEmailTemplates", passportConfig.authenticateJWT, leadController.getAllEmailTemplates);


router.get("/:leadId", leadController.findOneById);

router.patch("/:leadId", leadController.patch);

router.delete("/:leadId", leadController.deleteOne);

export default router;