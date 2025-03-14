import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import itemRoutes from './item.routes';
import categoryRoutes from './category.routes';
import uploadRoutes from './upload.routes';
import { ApiError } from '../middlewares/error.middleware';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);

// 404 handler for undefined routes
router.all('*', (req, res, next) => {
  next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

export default router; 