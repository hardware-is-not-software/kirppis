import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

/**
 * Upload a file
 * @route POST /api/v1/upload
 * @access Private
 */
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if file exists in the request
    if (!req.file) {
      res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
      return;
    }

    // Get the file from the request
    const file = req.file;
    
    // Generate a unique filename
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    
    // Define the upload directory - use environment variable if available
    const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../../uploads');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Define the file path
    const filePath = path.join(uploadDir, filename);
    
    // Write the file to disk
    fs.writeFileSync(filePath, file.buffer);
    
    // Generate the URL for the file
    const fileUrl = `/uploads/${filename}`;
    
    // Log the upload
    logger.info(`File uploaded: ${fileUrl} to ${uploadDir}`);
    
    // Return the file URL
    res.status(200).json({
      status: 'success',
      data: {
        imageUrl: fileUrl
      }
    });
  } catch (error) {
    logger.error('Error uploading file:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error uploading file'
    });
  }
}; 