import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs'

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
const fileFilter = (req: any, file: { originalname: string; mimetype: string; }, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|webp|avif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    const error = new Error('Only image files are allowed');
    cb(error as any, false); // Forcefully cast error to `any`
  }
};

export const uploadMul = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  }).fields([
    { name: 'themeImage', maxCount: 1 }, // Single file upload for theme image
    { name: 'images', maxCount: 20 },    // Multiple file upload for additional images
  ]);

// Convert uploaded images to WebP format
export const convertToWebP = (req: any, res: any, next: any) => {
    const files = req.files as Express.Multer.File[];
  
    if (!files || files.length === 0) {
      return next();
    }
  
    const convertPromises = files.map((file) => {
      const outputFilePath = path.join('uploads', `${file.filename.split('.')[0]}.webp`);
  
      return sharp(file.path)
        .webp()
        .toFile(outputFilePath)
        .then(() => {
          // Delete the original file after conversion
          fs.unlinkSync(file.path);
  
          // Replace the file path with the converted file path
          file.path = outputFilePath;
          file.filename = `${file.filename.split('.')[0]}.webp`; // Update the filename to .webp
        })
        .catch((err) => {
          console.error('Error converting image:', err);
          return Promise.reject(err);
        });
    });
  
    // Wait for all image conversions to complete before proceeding
    Promise.all(convertPromises)
      .then(() => next())
      .catch((err) => {
        res.status(500).json({ message: 'Error processing images', error: err });
      });
  };