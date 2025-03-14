import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/upload.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload route
router.post('/', protect, upload.single('image'), uploadFile);

export default router; 