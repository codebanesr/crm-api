import express from "express";
import * as roleController from "../controllers/role";
import * as passportConfig from "../config/passport";

const router = express.Router();

router.get("/", roleController.findAll);

router.post("/permission", roleController.addPermission);
router.get("/permissions", roleController.getAllPermissions);

router.get("/:roleId", roleController.findOneById);

router.patch("/:roleId", roleController.patch);

router.delete("/:roleId", roleController.deleteOne);


router.post("/createOrUpdate", roleController.createOrUpdate);
/** client should send the file in multi part form data and the name of the file dom element should be file 
 * there should only be one file being sent, otherwise multer will send back an error to the client..
 */
router.post("/", passportConfig.authenticateJWT, roleController.insertOne);

export default router;