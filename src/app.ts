import express from "express";
import passport from "passport";

// Controllers (route handlers)
import * as homeController from "@controllers/home";
import * as apiController from "@controllers/api";

// API keys and Passport configuration
import * as passportConfig from "@config/passport";

// Create Express server
const app = express();

// middleware initialization step
require('@starter/plugins')(app);

// database initialization
require('@starter/dbInit')(app);

/**
 * Primary app routes.
 */
require('@starter/initRoutes')(app);
/**
 * API examples routes.
 */
app.get("/", homeController.index);
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
    res.redirect(req.session.returnTo || "/");
});

export default app;
