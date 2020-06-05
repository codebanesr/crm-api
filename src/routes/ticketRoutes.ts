import express from "express";
import * as ticketController from "../controllers/ticket";
import * as passportConfig from "../config/passport";

const router = express.Router();

router.get("/", ticketController.findAll);

router.get("/:ticketId", ticketController.findOneById);

router.put("/:ticketId", passportConfig.authenticateJWT, ticketController.put);

router.delete("/:ticketId", ticketController.deleteOne);


router.get("/suggest/:leadId", ticketController.suggestLeads);

router.get("/lead/:leadId", ticketController.findByLeadId);


/** client should send the file in multi part form data and the name of the file dom element should be file 
 * there should only be one file being sent, otherwise multer will send back an error to the client..
 */
router.post("/", passportConfig.authenticateJWT, ticketController.insertOne);

export default router;