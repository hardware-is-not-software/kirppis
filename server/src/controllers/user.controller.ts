import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { ApiError } from '../middlewares/error.middleware';

/**
 * Get all users
 * @route GET /api/v1/users
 * @access Private/Admin
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * @route GET /api/v1/users/:id
 * @access Private
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 * @route PATCH /api/v1/users/:id
 * @access Private
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if user is trying to update password
    if (req.body.password) {
      return next(new ApiError(400, 'This route is not for password updates. Please use /auth/update-password'));
    }
    
    // Filter out unwanted fields that should not be updated
    const filteredBody: Record<string, any> = {};
    const allowedFields = ['name', 'email'];
    
    Object.keys(req.body).forEach(field => {
      if (allowedFields.includes(field)) {
        filteredBody[field] = req.body[field];
      }
    });
    
    // Check if user is updating their own profile or is an admin
    if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'You do not have permission to update this user'));
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedUser) {
      return next(new ApiError(404, 'User not found'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @route DELETE /api/v1/users/:id
 * @access Private/Admin
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change user role
 * @route PATCH /api/v1/users/:id/role
 * @access Private/Admin
 */
export const changeUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.body;
    
    if (!role) {
      return next(new ApiError(400, 'Role is required'));
    }
    
    // Prevent users from changing their own role
    if (req.params.id === req.user._id.toString()) {
      return next(new ApiError(403, 'You cannot change your own role'));
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedUser) {
      return next(new ApiError(404, 'User not found'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
}; 