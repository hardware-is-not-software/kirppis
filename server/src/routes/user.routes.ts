import { Router } from 'express';
// Import controllers when they are created
// import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';
// import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// User routes
// Protected routes - require authentication
// router.use(protect);

// Admin only routes
// router.route('/')
//   .get(restrictTo('admin'), getAllUsers);

// router.route('/:id')
//   .get(getUserById)
//   .patch(updateUser)
//   .delete(restrictTo('admin'), deleteUser);

// Placeholder route for now
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User routes are set up but controllers are not implemented yet'
  });
});

export default router; 