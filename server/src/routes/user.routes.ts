import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';

const router = Router();

// All user routes require authentication
router.use(protect);

// Routes accessible by all authenticated users
router.route('/:id')
  .get(getUserById)
  .patch(updateUser);

// Routes accessible only by admins
router.use(restrictTo(UserRole.ADMIN));

router.route('/')
  .get(getAllUsers);

router.route('/:id')
  .delete(deleteUser);

export default router; 