import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "candidate_files",
    resource_type: "raw", // 🔥 Detta tvingar Cloudinary att köra dokumentmappen (/raw/upload)
    flags: "attachment",  // 🔓 Gör att filen kan hämtas/öppnas utan restriktioner
  },
});

const upload = multer({ storage: storage });

export default upload;
