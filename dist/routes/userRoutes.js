"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
router.get("/lead/activity/:email", passportConfig.authenticateJWT, userController.leadActivityByUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map