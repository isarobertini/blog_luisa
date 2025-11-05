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
        let allowed_formats;

        if (file.mimetype.startsWith('audio/')) {
            resource_type = 'raw'; // MP3 must be raw
            // don't set allowed_formats for raw
        } else if (file.mimetype.startsWith('video/')) {
            resource_type = 'video';
            allowed_formats = ['mp4'];
        } else if (file.mimetype.startsWith('image/')) {
            resource_type = 'image';
            allowed_formats = ['jpg', 'png', 'webp'];
        }

        return {
            folder: 'messages',
            resource_type,
            ...(allowed_formats ? { allowed_formats } : {}),
            public_id: `${Date.now()}-${file.originalname}`,
        };
    },
});

export const parser = multer({ storage });