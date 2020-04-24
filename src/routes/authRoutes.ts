import express from "express";
import * as userController from "../controllers/user";
const router = express.Router();

router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);
router.get("/logout", userController.logout);
router.get("/forgot", userController.getForgot);
router.post("/forgot", userController.postForgot);
router.get("/reset/:token", userController.getReset);
router.post("/reset/:token", userController.postReset);
router.get("/signup", userController.getSignup);
router.post("/signup", userController.postSignup);

export default router;