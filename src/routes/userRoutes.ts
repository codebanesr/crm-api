import express from "express";
import * as passportConfig from "../config/passport";
import * as userController from "../controllers/user";

const router = express.Router();

router.get("/account", passportConfig.authenticateJWT, userController.getAccount);
router.post("/account/profile", passportConfig.authenticateJWT, userController.postUpdateProfile);
router.post("/account/password", passportConfig.authenticateJWT, userController.postUpdatePassword);
router.post("/account/delete", passportConfig.authenticateJWT, userController.postDeleteAccount);
router.get("/account/unlink/:provider", passportConfig.authenticateJWT, userController.getOauthUnlink);


export default router;