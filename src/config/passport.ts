import { NextFunction, Request, Response } from "express";
import passport from "passport";
// import passportApiKey from "passport-headerapikey";
import passportJwt from "passport-jwt";
import passportLocal from "passport-local";
import { User } from "../models/User";
import { JWT_SECRET } from "../util/secrets";


const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
        if (err) { return done(err); }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: "Invalid email or password." });
        });
    });
}));


passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    function (jwtToken, done) {
      User.findOne({ email: jwtToken.email }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(undefined, user, jwtToken);
        } else {
          return done(undefined, false);
        }
      });
    }
  )
);


/**
 * Login Required middleware.
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", function (err, user, info) {
        if (err) {
          console.log(err);
          return res.status(401).json({ status: "error", code: "unauthorized" });
        }
        if (!user) {
            return res.status(401).json({ status: "error", code: "unauthorized" });
        } else {
            req.isAuthenticated = () => true;
            return next();
        }
      })(req, res, next);
};

/**
 * Authorization Required middleware.
 */
export const authorizeJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", function (err, user, jwtToken) {
        if (err) {
            console.log(err);
            return res.status(401).json({ status: "error", code: "unauthorized" });
        }
        if (!user) {
            return res.status(401).json({ status: "error", code: "unauthorized" });
        } else {
            const scope = req.baseUrl.split("/").slice(-1)[0];
            const authScope = jwtToken.scope;
            if (authScope && authScope.indexOf(scope) > -1) {
                return next();
            }
            else {
                return res.status(401).json({ status: "error", code: "unauthorized" });
            }
        }
    })(req, res, next);
};
