import express from "express";
import * as agentController from "../controllers/agent";
import * as passportConfig from "../config/passport";
import { upload } from "../util/multerOpts";

const router = express.Router();


router.post("/many", passportConfig.authenticateJWT, upload.single("file"), agentController.insertMany);

router.get("/listActions", passportConfig.authenticateJWT, agentController.listActions);
router.get("/download", passportConfig.authenticateJWT, agentController.downloadFile);


export default router;