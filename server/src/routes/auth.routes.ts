import { Router } from 'express';
import { register, login, logout, getCurrentUser, updatePassword } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { registerValidation, loginValidation, updatePasswordValidation } from '../middlewares/validation.middleware';

const router = Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.use(protect);
router.post('/logout', logout);
router.get('/me', getCurrentUser);
router.patch('/update-password', updatePasswordValidation, updatePassword);

export default router; 