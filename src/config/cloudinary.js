import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// 1. Konfigurera Cloudinary med .env-variabler
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. 🧠 Lagra filen tillfälligt i serverns minne i stället för som en bild på Cloudinary
const storage = multer.memoryStorage();

// 3. Skapa Multer-instansen
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Gräns på 5MB per dokument
});

export default upload;
