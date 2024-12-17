import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import sharp from 'sharp';

const uploadDir = 'upload/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req: Request, file, cb) => {
        const ext = path.extname(file.originalname); // Keep original extension
        cb(null, `${Date.now()}${ext}`);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/avif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Set up multer for file upload
const uploadSeo = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 4, // 4 MB file size limit
    },
});

// Compress image with an initial resize and limited quality adjustment
const compressImage = async (filePath: string): Promise<string> => {
    const compressedPath = filePath.replace(path.extname(filePath), '.webp'); // Replace original extension with .webp
    const targetSize = 100 * 1024; // 25 KB target
    const maxWidth = 800; // Resize to max width if larger, reducing compression load
    let quality = 80;

    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Resize only if the width exceeds maxWidth
    if (metadata.width && metadata.width > maxWidth) {
        image.resize(maxWidth);
    }

    // Apply compression with initial quality
    let compressedBuffer = await image.webp({ quality }).toBuffer();

    // If the compressed size is still above the target, reduce quality further
    while (compressedBuffer.length > targetSize && quality > 20) {
        quality -= 10;
        compressedBuffer = await image.webp({ quality }).toBuffer();
    }

    // Save compressed image and return path
    await sharp(compressedBuffer).toFile(compressedPath);
    return compressedPath;
};

// Middleware to compress multiple images concurrently
const compressImageMiddlewareSeo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (req.files && typeof req.files === 'object') {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            // Map file compression promises for parallel processing
            const compressionTasks = Object.keys(files).flatMap((key) =>
                files[key].map(async (file) => {
                    const filePath = path.join(uploadDir, file.filename);
                    const compressedPath = await compressImage(filePath);

                    // Remove the original file and update compressed path
                    fs.unlinkSync(filePath);
                    file.path = compressedPath;
                    file.filename = path.basename(compressedPath); // Ensure file name ends with .webp
                })
            );

            await Promise.all(compressionTasks); // Process all files concurrently
            next();
        } catch (error) {
            console.error('Image compression failed:', error);
            return res.status(500).send({ error: 'Image compression failed' });
        }
    } else {
        next(); // No files to process
    }
};

export { uploadSeo, compressImageMiddlewareSeo };
