import { Router } from 'express';
// Import controllers when they are created
// import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
// import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Category routes
// Public routes - no authentication required
// router.get('/', getAllCategories);
// router.get('/:id', getCategoryById);

// Protected routes - require authentication and admin role
// router.use(protect);
// router.use(restrictTo('admin'));

// router.post('/', createCategory);
// router.patch('/:id', updateCategory);
// router.delete('/:id', deleteCategory);

// Placeholder route for now
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Category routes are set up but controllers are not implemented yet'
  });
});

export default router; 