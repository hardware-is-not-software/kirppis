import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/category.model';
import { ApiError } from '../middlewares/error.middleware';

/**
 * Get all categories
 * @route GET /api/v1/categories
 * @access Public
 */
export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Build query
    const query = Category.find();
    
    // Execute query
    const categories = await query;
    
    // Send response
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get category by ID
 * @route GET /api/v1/categories/:id
 * @access Public
 */
export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id).populate('childCategories');
    
    if (!category) {
      return next(new ApiError(404, 'Category not found'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new category
 * @route POST /api/v1/categories
 * @access Private/Admin
 */
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newCategory = await Category.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        category: newCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update category
 * @route PATCH /api/v1/categories/:id
 * @access Private/Admin
 */
export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!category) {
      return next(new ApiError(404, 'Category not found'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete category
 * @route DELETE /api/v1/categories/:id
 * @access Private/Admin
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if category has child categories
    const childCategories = await Category.find({ parentCategory: req.params.id });
    
    if (childCategories.length > 0) {
      return next(new ApiError(400, 'Cannot delete category with child categories. Please delete or reassign child categories first.'));
    }
    
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return next(new ApiError(404, 'Category not found'));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
}; 