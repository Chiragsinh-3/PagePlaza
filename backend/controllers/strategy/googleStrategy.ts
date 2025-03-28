import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { Request } from "express";
import User, { IUser } from "../../models/User";

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export const initializePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
        passReqToCallback: true,
      },
      async (
        req: Request,
        accessToken,
        refreshToken,
        profile,
        done: (error: any, user?: IUser | false) => void
      ) => {
        console.log("Google Strategy - Profile received:", {
          id: profile.id,
          emails: profile.emails,
          displayName: profile.displayName,
        });

        try {
          if (!profile.emails || !profile.emails[0]) {
            console.error("No email found in Google profile");
            return done(new Error("No email found from Google profile"));
          }

          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            console.log("Existing user found:", user._id);
            if (!user.profilePicture && profile.photos?.[0]?.value) {
              user.profilePicture = profile.photos[0].value;
              await user.save();
            }
            return done(null, user);
          }

          console.log("Creating new user from Google profile");
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos?.[0]?.value,
            isVerified: true,
            agreeTerms: true,
          });

          console.log("New user created:", newUser._id);
          return done(null, newUser);
        } catch (err) {
          console.error("Google Strategy Error:", err);
          return done(err);
        }
      }
    )
  );
};
