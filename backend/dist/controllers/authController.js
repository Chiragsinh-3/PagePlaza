"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserAuth = exports.deleteUser = exports.updateUserDetails = exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.verifyEmail = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const responseHandler_1 = require("../utils/responseHandler");
const crypto_1 = __importDefault(require("crypto"));
const emailConfig_1 = require("../config/emailConfig");
const generateToken_1 = require("../utils/generateToken");
const register = async (req, res) => {
    try {
        const { name, email, password, agreeTerms } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return (0, responseHandler_1.response)(res, 400, "User Already Exist");
        }
        const verificationToken = crypto_1.default.randomBytes(20).toString("hex");
        const user = new User_1.default({
            name,
            email,
            password,
            agreeTerms,
            verificationToken,
        });
        await user.save();
        await (0, emailConfig_1.sendVerificationToEmail)(user.email, verificationToken);
        await (0, emailConfig_1.sendWelcomeEmail)(user.email);
        console.log("Verification Token:", verificationToken);
        return (0, responseHandler_1.response)(res, 200, "User Created Successfully, Check your Email to verify your account");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.register = register;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        console.log("Searching for token:", token);
        const user = await User_1.default.findOne({ verificationToken: token });
        console.log("Found user:", user ? "Yes" : "No");
        if (!user) {
            return (0, responseHandler_1.response)(res, 404, "Invalid verification token");
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        const accesstoken = (0, generateToken_1.generateToken)(user);
        res.cookie("accessToken", accesstoken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        });
        await user.save();
        return (0, responseHandler_1.response)(res, 200, "Email verified successfully");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.verifyEmail = verifyEmail;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return (0, responseHandler_1.response)(res, 400, "Invalid Email or Password");
        }
        if (!user.isVerified) {
            return (0, responseHandler_1.response)(res, 400, "Email not verified");
        }
        const accessToken = (0, generateToken_1.generateToken)(user);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        };
        res.cookie("accessToken", accessToken, cookieOptions);
        return (0, responseHandler_1.response)(res, 200, "Login Successful", {
            user,
            token: accessToken,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.cookie("accessToken", "", {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        });
        return (0, responseHandler_1.response)(res, 200, "Logout Successful");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return (0, responseHandler_1.response)(res, 404, "User not found");
        }
        const resetToken = crypto_1.default.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await user.save();
        await (0, emailConfig_1.sendPasswordResetEmail)(user.email, resetToken);
        return (0, responseHandler_1.response)(res, 200, "Password reset email sent");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "Invalid or expired token");
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return (0, responseHandler_1.response)(res, 200, "Password reset successful");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.resetPassword = resetPassword;
const updateUserDetails = async (req, res) => {
    try {
        const { name, phoneNumber, email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "User does not exist");
        }
        user.name = name;
        user.phoneNumber = phoneNumber;
        await user.save();
        return (0, responseHandler_1.response)(res, 200, "User details updated successfully");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.updateUserDetails = updateUserDetails;
const deleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "User does not exist");
        }
        await User_1.default.deleteOne({ email });
        console.log(email, "deleted successfully");
        return (0, responseHandler_1.response)(res, 200, "User deleted successfully");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.deleteUser = deleteUser;
const checkUserAuth = async (req, res) => {
    try {
        const userId = req.id;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthenticated, please login to access");
        }
        const user = await User_1.default.findById(userId).select("-password -resetPasswordToken -resetPasswordExpires -verificationToken -__v");
        if (!user) {
            return (0, responseHandler_1.response)(res, 404, "User not found");
        }
        return (0, responseHandler_1.response)(res, 200, "User retrieved successfully", { user });
    }
    catch (error) {
        console.error("Check auth error:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.checkUserAuth = checkUserAuth;
