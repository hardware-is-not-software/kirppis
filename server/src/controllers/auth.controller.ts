import { Request, Response, NextFunction } from 'express';
// import { User, UserRole } from '../models/user.model';
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
const generateAuthToken = (user: any) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
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
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return next(new ApiError(400, 'User with this email already exists'));
    }

    // Create new user
    const newUser = {
      _id: (mockUsers.length + 1).toString(),
      name,
      email,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);

    // Generate JWT token
    const token = generateAuthToken(newUser);

    // Return user data and token
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        }
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

    // Find user by email
    const user = mockUsers.find(user => user.email === email);
    if (!user) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    // Check password
    if (user.password !== password) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    // Generate JWT token
    const token = generateAuthToken(user);

    // Return user data and token
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
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
  // In a real app, we might invalidate the token
  // For now, just return success
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
  // In a real app, we would get the user from the request object
  // For now, just return a mock user
  const user = mockUsers[0];
  
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
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

    // In a real app, we would get the user from the request object
    // For now, just use a mock user
    const user = mockUsers[0];

    // Check if current password is correct
    if (user.password !== currentPassword) {
      return next(new ApiError(401, 'Current password is incorrect'));
    }

    // Update password
    user.password = newPassword;
    user.updatedAt = new Date().toISOString();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
}; 