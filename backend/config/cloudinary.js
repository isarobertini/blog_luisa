import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config(); // ✅ ensures env vars exist

// Configure Cloudinary with credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'messages', // optional folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'mp4', 'mp3'], // allowed file types
    },
});

// Export a Multer parser to use in routes
export const parser = multer({ storage });
