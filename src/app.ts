import express from "express";

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as apiController from "./controllers/api";

import * as passportConfig from "./config/passport";
import initRoutes from "./starter/initRoutes";
import dbInit from "./starter/dbInit";
import pluginStarter from "./starter/plugins";

const app = express();

pluginStarter(app);
dbInit(app);
initRoutes(app);


app.get("/", homeController.index);
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.authenticateJWT, passportConfig.authenticateJWT, apiController.getFacebook);

export default app;
