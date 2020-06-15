import express from "express";
import * as alarmController from "../controllers/alarm";
import * as passportConfig from "../config/passport";


const router = express.Router();

router.post("/findAll", passportConfig.authenticateJWT ,alarmController.findAll);

router.get("/:alarmId", alarmController.findOneById);

router.patch("/:alarmId", alarmController.patch);

router.delete("/:alarmId", alarmController.deleteOne);

export default router;