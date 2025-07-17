"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.multerMiddleware = void 0;
// @ts-nocheck
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = (file) => {
    const options = {
        resource_type: "image",
        folder: "pageplaza",
        use_filename: true,
        unique_filename: true,
    };
    return new Promise((resolve, reject) => {
        // Create a buffer stream from the file buffer
        const streamifier = require('streamifier');
        const stream = cloudinary_1.v2.uploader.upload_stream(options, (error, result) => {
            if (error || !result) {
                console.error("Cloudinary upload error:", error);
                return reject(error || new Error("Upload failed"));
            }
            resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
// Use memory storage instead of disk storage
const storage = multer_1.default.memoryStorage();
const multerMiddleware = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 4, // Maximum 4 files
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    },
}).array("images", 4);
exports.multerMiddleware = multerMiddleware;
