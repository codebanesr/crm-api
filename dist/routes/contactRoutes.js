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
const passport = __importStar(require("../config/passport"));
const contactController = __importStar(require("../controllers/contact"));
const router = express_1.default.Router();
router.get("/", passport.authenticateJWT, contactController.getContact);
router.post("/", contactController.postContact);
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map