"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const mongoose_1 = __importDefault(require("mongoose"));
const connectDb = async () => {
    try {
        const connection = await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(":::::::::mongodb connected:::::::::");
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
exports.default = connectDb;
