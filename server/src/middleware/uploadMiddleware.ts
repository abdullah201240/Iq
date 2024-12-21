import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/'); // Define your upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Keep original name
  },
});

// File filter to accept only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp|avif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    // Use a standard Error object, this is acceptable for multer's callback
    const error = new Error('Only image files are allowed');
    cb(error as any, false); // We cast to `any` to make it compatible with multer
  }
};



export const uploadMul = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).fields([
  { name: 'themeImage', maxCount: 1 }, // Single file upload for theme image
  { name: 'images', maxCount: 20 }, // Multiple file upload for additional images
]);

export const convertToWebP = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files || Object.keys(files).length === 0) {
    return next();
  }

  const allFiles = [
    ...(files['themeImage'] || []),
    ...(files['images'] || []),
  ]; // Combine all uploaded files

  try {
    const convertPromises = allFiles.map((file) => {
      // Generate a timestamp-based filename for the output WebP file
      const timestamp = Date.now();  // You can also use `new Date().toISOString()` for a more readable timestamp
      const outputFilePath = path.join('upload', `${timestamp}-${file.originalname.split('.')[0]}.webp`);

      return sharp(file.path)
        .webp()
        .toFile(outputFilePath)
        .then(() => {
          // Delete the original file after conversion
          fs.unlinkSync(file.path);

          // Replace the file path with the converted file path
          file.path = outputFilePath;
          file.filename = `${timestamp}-${file.originalname.split('.')[0]}.webp`; // Update the filename to use timestamp
        })
        .catch((err: unknown) => {
          // Type assertion to 'Error' for proper access
          if (err instanceof Error) {
            console.error(`Error converting ${file.filename}:`, err.message);
          } else {
            console.error(`Unknown error converting ${file.filename}:`, err);
          }
          throw err; // Re-throw the error to be caught by the outer catch block
        });
    });

    await Promise.all(convertPromises);
    next();
  } catch (err: unknown) {
    // Narrow the type of err here as well
    if (err instanceof Error) {
      res.status(500).json({ message: 'Error processing images', error: err.message });
    } else {
      res.status(500).json({ message: 'Error processing images', error: 'Unknown error' });
    }
  }
};

