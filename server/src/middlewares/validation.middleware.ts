import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { ApiError } from './error.middleware';
import { ItemCondition, ItemStatus } from '../models/item.model';
import mongoose from 'mongoose';

/**
 * Middleware to check validation results
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => `${err.msg}`).join(', ');
    return next(new ApiError(400, errorMessages));
  }
  next();
};

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  validate
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate
];

/**
 * Validation rules for updating password
 */
export const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  validate
];

/**
 * Validation rules for creating an item
 */
export const createItemValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value >= 0).withMessage('Price cannot be negative'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid category ID'),
  
  body('condition')
    .notEmpty().withMessage('Condition is required')
    .isIn(Object.values(ItemCondition)).withMessage('Invalid condition value'),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),
  
  validate
];

/**
 * Validation rules for updating an item
 */
export const updateItemValidation = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  
  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value >= 0).withMessage('Price cannot be negative'),
  
  body('category')
    .optional()
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid category ID'),
  
  body('condition')
    .optional()
    .isIn(Object.values(ItemCondition)).withMessage('Invalid condition value'),
  
  body('status')
    .optional()
    .isIn(Object.values(ItemStatus)).withMessage('Invalid status value'),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),
  
  validate
];

/**
 * Validation rules for creating a category
 */
export const createCategoryValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters'),
  
  body('parentCategory')
    .optional()
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid parent category ID'),
  
  validate
];

/**
 * Validation for MongoDB ObjectId
 */
export const validateObjectId = [
  param('id')
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid ID format'),
  
  validate
]; 