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
        scope: ["profile", "email"],
      },

      async (
        req: Request,
        accessToken,
        refreshToken,
        profile,
        done: (error: any, user?: IUser | false) => void
      ) => {
        const { emails, displayName, photos } = profile;
        console.log("this is my Profile", profile);
        try {
          if (!emails || !emails[0]) {
            return done(new Error("No email found from Google profile"));
          }
          let user = await User.findOne({ email: emails[0].value });
          if (user) {
            if (!user.profilePicture && photos?.[0]?.value) {
              user.profilePicture = photos[0]?.value;
              await user.save();
            }
            return done(null, user);
          }
          user = await User.create({
            googleId: profile.id,
            name: displayName,
            email: emails[0].value,
            profilePicture: photos?.[0]?.value,
            isVerified: true,
            agreeTerms: true,
          });
          console.log(user, "user created");
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
};
