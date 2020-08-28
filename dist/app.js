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
const passportConfig = __importStar(require("./config/passport"));
const apiController = __importStar(require("./controllers/api"));
// Controllers (route handlers)
const homeController = __importStar(require("./controllers/home/home"));
const dbInit_1 = __importDefault(require("./starter/dbInit"));
const initRoutes_1 = __importDefault(require("./starter/initRoutes"));
const plugins_1 = __importDefault(require("./starter/plugins"));
const redis_container_1 = require("./starter/redis-container");
const app = express_1.default();
plugins_1.default(app);
dbInit_1.default(app);
initRoutes_1.default(app);
redis_container_1.RedisContainer.initialize();
app.get("/", homeController.index);
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.authenticateJWT, passportConfig.authenticateJWT, apiController.getFacebook);
exports.default = app;
//# sourceMappingURL=app.js.map