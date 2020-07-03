"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleController = __importStar(require("../controllers/role"));
const passportConfig = __importStar(require("../config/passport"));
const router = express_1.default.Router();
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
exports.default = router;
//# sourceMappingURL=roleRoutes.js.map