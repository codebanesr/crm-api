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
const passportConfig = __importStar(require("./config/passport"));
const apiController = __importStar(require("./controllers/api"));
// Controllers (route handlers)
const homeController = __importStar(require("./controllers/home"));
const dbInit_1 = __importDefault(require("./starter/dbInit"));
const initRoutes_1 = __importDefault(require("./starter/initRoutes"));
const plugins_1 = __importDefault(require("./starter/plugins"));
const app = express_1.default();
plugins_1.default(app);
dbInit_1.default(app);
initRoutes_1.default(app);
app.get("/", homeController.index);
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.authenticateJWT, passportConfig.authenticateJWT, apiController.getFacebook);
exports.default = app;
//# sourceMappingURL=app.js.map