import express from "express";
import * as contactController from "../controllers/contact";
import * as passport from "../config/passport";

const router = express.Router();
router.get("/", passport.authenticateJWT,contactController.getContact);
router.post("/", contactController.postContact);



export default router;