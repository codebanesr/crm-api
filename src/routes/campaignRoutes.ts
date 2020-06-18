import express from "express";
import * as campaignController from "../controllers/campaign";
import * as passportConfig from "../config/passport";
import { upload } from "../util/multerOpts";

const router = express.Router();

router.post("/get", campaignController.findAll);

router.get("/:campaignId", campaignController.findOneById);

router.patch("/:campaignId", campaignController.patch);

router.delete("/:campaignId", campaignController.deleteOne);


router.get("/autocomplete/suggestEmails", campaignController.getHandlerEmailHints);

router.get("/autocomplete/suggestTypes", campaignController.getCampaignTypes);

router.post("/config/upload", passportConfig.authenticateJWT, upload.single("file"), campaignController.uploadConfig);
export default router;