import express from "express";
import * as customerController from "../controllers/customer";
import * as passportConfig from "../config/passport";
import { upload } from "../util/multerOpts";

const router = express.Router();

router.get("/", customerController.findAll);

router.get("/:productId", customerController.findOneById);

router.patch("/:productId", customerController.patch);

router.delete("/:productId", customerController.deleteOne);


/** client should send the file in multi part form data and the name of the file dom element should be file 
 * there should only be one file being sent, otherwise multer will send back an error to the client..
 */
router.post("/many", passportConfig.authenticateJWT, upload.single("file"), customerController.insertMany);

export default router;