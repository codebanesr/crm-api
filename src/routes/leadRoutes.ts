import express from "express";
import * as leadController from "../controllers/lead";
import * as passportConfig from "../config/passport";

const router = express.Router();

router.post("/", passportConfig.authenticateJWT, leadController.findAll);
router.post("/", passportConfig.authenticateJWT, leadController.sendBulkEmails)

router.get("/getAllLeadColumns", leadController.getAllLeadColumns);

router.get("/:leadId", leadController.findOneById);

router.patch("/:leadId", leadController.patch);

router.delete("/:leadId", leadController.deleteOne);


/** client should send the file in multi part form data and the name of the file dom element should be file 
 * there should only be one file being sent, otherwise multer will send back an error to the client..
 */
router.post("/", passportConfig.authenticateJWT, leadController.insertOne);

export default router;