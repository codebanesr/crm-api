import express from "express";
import * as contactController from "../src/controllers/contact";

const router = express.Router();
router.get("/", contactController.getContact);
router.post("/", contactController.postContact);



export default router;