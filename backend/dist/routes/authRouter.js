"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const passport_1 = __importDefault(require("passport"));
const generateToken_1 = require("../utils/generateToken");
const router = (0, express_1.Router)();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.get("/verify/:token", authController_1.verifyEmail);
router.get("/logout", authController_1.logout);
router.post("/forgot-password", authController_1.forgotPassword);
router.post("/reset-password/:token", authController_1.resetPassword);
router.get("/verify-auth", authMiddleware_1.authenticatedUser, authController_1.checkUserAuth);
router.put("/update-user-details", authController_1.updateUserDetails);
// router.get("/delete-user", deleteUser);
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// Google callback Route
router.get("/google/callback", (req, res, next) => {
    console.log("Google callback received");
    passport_1.default.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_PORT}/auth?error=google-auth-failed`,
        session: false,
    })(req, res, next);
}, async (req, res) => {
    try {
        console.log("Google authentication successful");
        if (!req.user) {
            console.error("No user data in request");
            throw new Error("Authentication failed - No user data");
        }
        const user = req.user;
        console.log("Generating token for user:", user._id);
        const accessToken = (0, generateToken_1.generateToken)(user);
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        };
        console.log("Setting cookie with options:", cookieOptions);
        res.cookie("accessToken", accessToken, cookieOptions);
        console.log("Redirecting to success page");
        return res.redirect(`${process.env.FRONTEND_PORT}/auth/google/success`);
    }
    catch (error) {
        console.error("Google callback error:", error);
        return res.redirect(`${process.env.FRONTEND_PORT}/auth?error=server-error`);
    }
});
exports.default = router;
