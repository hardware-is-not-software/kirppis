import { Router } from 'express';
// Import controllers when they are created
// import { register, login, logout, refreshToken, forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = Router();

// Authentication routes
// router.post('/register', register);
// router.post('/login', login);
// router.post('/logout', logout);
// router.post('/refresh-token', refreshToken);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

// Placeholder route for now
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Auth routes are set up but controllers are not implemented yet'
  });
});

export default router; 