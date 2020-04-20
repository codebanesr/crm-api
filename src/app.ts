import express from "express";
import passport from "passport";

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as apiController from "./controllers/api";

import * as passportConfig from "./config/passport";
import initRoutes from "./starter/initRoutes";
import dbInit from "./starter/dbInit";
import pluginStarter from "./starter/plugins";
import path from "path";

const app = express();

pluginStarter(app);
dbInit(app);
initRoutes(app);


app.get("/", homeController.index);
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
    res.status(200).send("face");
});

export default app;
