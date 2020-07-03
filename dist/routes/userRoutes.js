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
const passportConfig = __importStar(require("../config/passport"));
const userController = __importStar(require("../controllers/user"));
const multerOpts_1 = require("../util/multerOpts");
const router = express_1.default.Router();
router.get("/allUsers", passportConfig.authenticateJWT, userController.getAll);
router.get("/accountDetails", passportConfig.authenticateJWT, userController.getAccount);
router.post("/updateProfile", passportConfig.authenticateJWT, userController.postUpdateProfile);
router.post("/updatePassword", passportConfig.authenticateJWT, userController.postUpdatePassword);
router.post("/deleteAccount", passportConfig.authenticateJWT, userController.postDeleteAccount);
router.get("/account/unlink/:provider", passportConfig.authenticateJWT, userController.getOauthUnlink);
router.post("/many", passportConfig.authenticateJWT, multerOpts_1.upload.single("file"), userController.insertMany);
router.get("/latestUploadedFile", userController.getLatestUploadedFiles);
router.post("/assignManager", passportConfig.authenticateJWT, userController.assignManager);
router.get("/managersForReassignment", passportConfig.authenticateJWT, userController.managersForReassignment);
router.get("/getUserReassignmentHistory", passportConfig.authenticateJWT, userController.getUserReassignmentHistory);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map