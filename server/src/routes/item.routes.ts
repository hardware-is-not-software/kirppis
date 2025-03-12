import { Router } from 'express';
// Import controllers when they are created
// import { getAllItems, getItemById, createItem, updateItem, deleteItem } from '../controllers/item.controller';
// import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Item routes
// Public routes - no authentication required
// router.get('/', getAllItems);
// router.get('/:id', getItemById);

// Protected routes - require authentication
// router.use(protect);

// router.post('/', createItem);
// router.patch('/:id', updateItem);
// router.delete('/:id', deleteItem);

// Placeholder route for now
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Item routes are set up but controllers are not implemented yet'
  });
});

export default router; 