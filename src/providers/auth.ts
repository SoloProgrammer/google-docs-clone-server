import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../schemas/User.js";

import dotenv from "dotenv";

dotenv.config();

export const connectPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async function (accessToken, refreshToken, profile, done) {
        // Store user into Db

        let user = await User.findOne({
          googleId: profile.id,
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            avatar: profile.photos ? profile.photos[0].value : "",
            googleId: profile.id,
            email: profile.emails ? profile.emails[0].value : "",
          });
        }

        done(null, user);
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
