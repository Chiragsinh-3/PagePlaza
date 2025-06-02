"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatedUser = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticatedUser = async (req, res, next) => {
    try {
        // console.log("Auth Middleware - All cookies:", req.cookies);
        // console.log("Auth Middleware - Headers:", req.headers);
        let token = req.cookies.accessToken; // Changed from token to accessToken
        // Also check Authorization header as fallback
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        console.log("Auth Middleware - Token found:", token ? "Yes" : "No");
        if (!token) {
            return (0, responseHandler_1.response)(res, 401, "Please login to access this resource");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log("Auth Middleware - Token decoded:", decoded);
            if (!decoded || !decoded.userId) {
                return (0, responseHandler_1.response)(res, 401, "Invalid token");
            }
            req.id = decoded.userId;
            next();
        }
        catch (jwtError) {
            console.error("JWT Verification failed:", jwtError);
            return (0, responseHandler_1.response)(res, 401, "Invalid token");
        }
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return (0, responseHandler_1.response)(res, 500, "Authentication error");
    }
};
exports.authenticatedUser = authenticatedUser;
