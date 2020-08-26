import express from "express";
import * as passportConfig from "./config/passport";
import * as apiController from "./controllers/api";
// Controllers (route handlers)
import * as homeController from "./controllers/home/home";
import dbInit from "./starter/dbInit";
import initRoutes from "./starter/initRoutes";
import pluginStarter from "./starter/plugins";
import {RedisContainer} from './starter/redis-container'


const app = express();

pluginStarter(app);
dbInit(app);
initRoutes(app);
RedisContainer.initialize();


app.get("/", homeController.index);
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.authenticateJWT, passportConfig.authenticateJWT, apiController.getFacebook);

export default app;
