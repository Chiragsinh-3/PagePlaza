"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../../models/User"));
dotenv_1.default.config();
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
const initializePassport = () => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) => {
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
            let user = await User_1.default.findOne({ email: profile.emails[0].value });
            if (user) {
                console.log("Existing user found:", user._id);
                if (!user.profilePicture && profile.photos?.[0]?.value) {
                    user.profilePicture = profile.photos[0].value;
                    await user.save();
                }
                return done(null, user);
            }
            console.log("Creating new user from Google profile");
            const newUser = await User_1.default.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePicture: profile.photos?.[0]?.value,
                isVerified: true,
                agreeTerms: true,
            });
            console.log("New user created:", newUser._id);
            return done(null, newUser);
        }
        catch (err) {
            console.error("Google Strategy Error:", err);
            return done(err);
        }
    }));
};
exports.initializePassport = initializePassport;
