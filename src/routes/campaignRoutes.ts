import express from "express";
import * as campaignController from "../controllers/campaign";

const router = express.Router();

router.post("/get", campaignController.findAll);

router.get("/:campaignId", campaignController.findOneById);

router.patch("/:campaignId", campaignController.patch);

router.delete("/:campaignId", campaignController.deleteOne);


router.get("/autocomplete/suggestEmails", campaignController.getHandlerEmailHints);

router.get("/autocomplete/suggestTypes", campaignController.getCampaignTypes);
export default router;