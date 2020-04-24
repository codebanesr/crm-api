import express from "express";
import * as passport from "../config/passport";
import * as contactController from "../controllers/contact";

const router = express.Router();
router.get("/", passport.authenticateJWT,contactController.getContact);
router.post("/", contactController.postContact);



export default router;