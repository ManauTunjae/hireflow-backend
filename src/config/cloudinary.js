import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// 1. Konfigurera Cloudinary med .env-variabler
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Ställ in lagringen
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "candidate_files",
    allowed_formats: ["pdf", "jpg", "png"],
  },
});

// 3. Skapa Multer-instansen
const upload = multer({ storage: storage });

export default upload;
