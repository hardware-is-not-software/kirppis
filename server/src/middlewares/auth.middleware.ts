import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User, UserRole } from '../models/user.model';
import { ApiError } from './error.middleware';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to protect routes - verifies JWT token
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookie (if implemented)
    // else if (req.cookies.jwt) {
    //   token = req.cookies.jwt;
    // }
    
    // Check if token exists
    if (!token) {
      return next(new ApiError(401, 'You are not logged in. Please log in to get access.'));
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: UserRole };
    
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
    }
    
    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid token. Please log in again.'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Your token has expired. Please log in again.'));
    }
    next(error);
  }
};

/**
 * Middleware to restrict access based on user role
 */
export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if user exists and has required role
    if (!req.user) {
      return next(new ApiError(401, 'You are not logged in. Please log in to get access.'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.'));
    }
    
    next();
  };
}; 