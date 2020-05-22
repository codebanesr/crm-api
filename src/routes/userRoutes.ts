import express from "express";
import * as passportConfig from "../config/passport";
import * as userController from "../controllers/user";

const router = express.Router();

router.get("/accountDetails", passportConfig.authenticateJWT, userController.getAccount);
router.post("/updateProfile", passportConfig.authenticateJWT, userController.postUpdateProfile);
router.post("/updatePassword", passportConfig.authenticateJWT, userController.postUpdatePassword);
router.post("/deleteAccount", passportConfig.authenticateJWT, userController.postDeleteAccount);
router.get("/account/unlink/:provider", passportConfig.authenticateJWT, userController.getOauthUnlink);


export default router;