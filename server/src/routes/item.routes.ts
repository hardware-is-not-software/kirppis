import { Router } from 'express';
import { 
  getAllItems, 
  getItemById, 
  createItem, 
  updateItem, 
  deleteItem,
  reserveItem,
  cancelReservation,
  markItemAsSold
} from '../controllers/item.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllItems);
router.get('/:id', getItemById);

// Protected routes - require authentication
router.use(protect);

router.post('/', createItem);
router.patch('/:id', updateItem);
router.delete('/:id', deleteItem);

// Item reservation and status routes
router.patch('/:id/reserve', reserveItem);
router.patch('/:id/cancel-reservation', cancelReservation);
router.patch('/:id/mark-sold', markItemAsSold);

export default router; 