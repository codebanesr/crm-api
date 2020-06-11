import express from "express";
import * as campaignController from "../controllers/campaign";

const router = express.Router();

router.get("/", campaignController.findAll);

router.get("/:campaignId", campaignController.findOneById);

router.patch("/:campaignId", campaignController.patch);

router.delete("/:campaignId", campaignController.deleteOne);


router.get("/autocomplete/suggestEmails", campaignController.getHandlerEmailHints);

export default router;