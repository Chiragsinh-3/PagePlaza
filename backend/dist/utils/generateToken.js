"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
// @ts-nocheck
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    // Generate a JWT token with the user's ID and a secret key
    // The token will expire in 1 day
    return jsonwebtoken_1.default.sign({ userId: user?._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
exports.generateToken = generateToken;
