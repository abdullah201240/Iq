import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { Request} from 'express';
import fs from 'fs';

const uploadDir = 'uploadPdf';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req: Request, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Allowed MIME types for PDF and Word documents
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-word.document.macroEnabled.12', // .docm
        'application/vnd.oasis.opendocument.text', // .odt
        'application/rtf', // Rich Text Format
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Create multer instance
const uploadPdf = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB file size limit
    },
});

// Export the uploadPdf middleware
export { uploadPdf };
