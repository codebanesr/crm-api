import express from "express";
import * as attachmentController from "../controllers/attachments";
import * as passportConfig from "../config/passport";
import { upload } from "../util/multerOpts";

const router = express.Router();


router.get("/getAllFiles", passportConfig.authenticateJWT,  attachmentController.getAllFiles);
router.post("/uploadFile", passportConfig.authenticateJWT, upload.single("file"), attachmentController.uploadFile);


export default router;