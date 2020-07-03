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
const alarmController = __importStar(require("../controllers/alarm"));
const passportConfig = __importStar(require("../config/passport"));
const router = express_1.default.Router();
router.post("/findAll", passportConfig.authenticateJWT, alarmController.findAll);
router.get("/:alarmId", alarmController.findOneById);
router.patch("/:alarmId", alarmController.patch);
router.delete("/:alarmId", alarmController.deleteOne);
exports.default = router;
//# sourceMappingURL=alarmRoutes.js.map