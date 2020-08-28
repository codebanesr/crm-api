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
const customerController = __importStar(require("../controllers/customer"));
const passportConfig = __importStar(require("../config/passport"));
const multerOpts_1 = require("../util/multerOpts");
const router = express_1.default.Router();
router.get("/", customerController.findAll);
router.get("/:productId", customerController.findOneById);
router.patch("/:productId", customerController.patch);
router.delete("/:productId", customerController.deleteOne);
/** client should send the file in multi part form data and the name of the file dom element should be file
 * there should only be one file being sent, otherwise multer will send back an error to the client..
 */
router.post("/many", passportConfig.authenticateJWT, multerOpts_1.upload.single("file"), customerController.insertMany);
exports.default = router;
//# sourceMappingURL=customerRoutes.js.map