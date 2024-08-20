import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';
import { RequestHandler } from 'express';

// Define a directory for uploads
const BASE_UPLOADS_DIR = path.join(__dirname, '../uploads');

class MulterServices {
  private upload: Multer;

  constructor() {
    // Ensure the base uploads directory exists
    if (!fs.existsSync(BASE_UPLOADS_DIR)) {
      fs.mkdirSync(BASE_UPLOADS_DIR, { recursive: true });
    }

    // Initialize the multer instance without any specific configuration
    this.upload = multer();
  }

  // Method to get multer middleware for file upload
  public getUploadMiddleware(fieldName: string, subDir: string = 'files'): RequestHandler {
    const uploadDir = path.join(BASE_UPLOADS_DIR, subDir);

    // Ensure the sub-directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Configure multer storage
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
      },
    });

    // Create a new multer instance with the specified storage configuration
    const upload = multer({ storage });

    // Return the middleware function
    return upload.single(fieldName);
  }

  
}

const MulterService = new MulterServices();
export default MulterService

