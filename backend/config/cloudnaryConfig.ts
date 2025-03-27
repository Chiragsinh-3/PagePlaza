import multer from "multer";
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import dotenv from "dotenv";
import { RequestHandler } from "express";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

interface CustomFile extends Express.Multer.File {
  path: string;
}

const uploadToCloudinary = (file: CustomFile): Promise<UploadApiResponse> => {
  const options: UploadApiOptions = {
    resource_type: "image",
    folder: "pageplaza", // Add a folder to organize uploads
    use_filename: true,
    unique_filename: true,
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, options, (error, result) => {
      if (error || !result) {
        console.error("Cloudinary upload error:", error);
        return reject(error || new Error("Upload failed"));
      }
      resolve(result as UploadApiResponse);
    });
  });
};

// Update storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// More flexible Multer configuration
const multerMiddleware: RequestHandler = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 4, // Maximum 4 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
}).array("images", 4);

export { multerMiddleware, uploadToCloudinary };
