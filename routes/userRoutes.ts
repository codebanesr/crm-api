import express from "express";
import * as userController from "../src/controllers/user";
import * as passportConfig from "../src/config/passport";

const router = express.Router();

router.get("/account", passportConfig.isAuthenticated, userController.getAccount);
router.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
router.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
router.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
router.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);


export default router;