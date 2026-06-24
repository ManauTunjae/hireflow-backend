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
    resource_type: "raw",
    // 🔥 FIXEN FÖR 404: Denna klipper bort .pdf från namnet innan det skickas!
    public_id: (req, file) => {
      const parsedName = file.originalname.split('.').slice(0, -1).join('.');
      return `${Date.now()}-${parsedName}`;
    }
  },
});

const upload = multer({ storage: storage });

export default upload;
