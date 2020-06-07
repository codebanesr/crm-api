import express from "express";
import * as agentController from "../controllers/agent";
import * as passportConfig from "../config/passport";
import { upload } from "../util/multerOpts";

const router = express.Router();


router.post("/many", passportConfig.authenticateJWT, upload.single("file"), agentController.insertMany);


export default router;