import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/user.model';
import { ApiError } from '../middlewares/error.middleware';
import { config } from '../config/env';
import jwt from 'jsonwebtoken';

// Mock user data
const mockUsers = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Test User',
    email: 'user@example.com',
    password: 'User123!',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper function to generate JWT token
const generateAuthToken = (user: any): string => {
  const payload = { id: user._id, role: user.role };
  return jwt.sign(
    payload, 
    config.jwtSecret as jwt.Secret, 
    { expiresIn: config.jwtExpiresIn as any }
  );
};

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, 'User with this email already exists'));
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: UserRole.USER // Default role
    });

    // Generate JWT token
    const token = user.generateAuthToken();

    // Send response
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password'));
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError(401, 'Incorrect email or password'));
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Remove password from output
    user.password = undefined as any;

    // Send response
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
export const logout = (req: Request, res: Response): void => {
  // If using cookies, clear the cookie
  // res.cookie('jwt', 'loggedout', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true
  // });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

/**
 * Get current user
 * @route GET /api/v1/auth/me
 * @access Private
 */
export const getCurrentUser = (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

/**
 * Update password
 * @route PATCH /api/v1/auth/update-password
 * @access Private
 */
export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user from database with password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return next(new ApiError(401, 'Current password is incorrect'));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = user.generateAuthToken();

    // Send response
    res.status(200).json({
      status: 'success',
      token,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
}; 