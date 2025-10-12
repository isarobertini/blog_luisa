// cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
        let resource_type = 'auto';
        if (file.mimetype.startsWith('audio/')) {
            resource_type = 'raw'; // MP3 must use 'raw'
        }
        return {
            folder: 'messages',
            resource_type,
            allowed_formats: ['jpg', 'png', 'webp', 'mp4', 'mp3'],
            public_id: `${Date.now()}-${file.originalname}`,
        };
    },
});


export const parser = multer({ storage });
