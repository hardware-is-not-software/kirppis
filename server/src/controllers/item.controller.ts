import { Request, Response, NextFunction } from 'express';
import { Item, ItemStatus, IItem } from '../models/item.model';
import { ApiError } from '../middlewares/error.middleware';

/**
 * Get all items with filtering, sorting, and pagination
 * @route GET /api/v1/items
 * @access Public
 */
export const getAllItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Build query
    const queryObj = { ...req.query };
    
    // Fields to exclude from filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // Find items
    let query = Item.find(JSON.parse(queryStr)) as any;
    
    // Sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Field limiting
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    // Execute query
    const items = await query.populate([
      { path: 'category', select: 'name' },
      { path: 'seller', select: 'name email' }
    ]);
    
    // Send response
    res.status(200).json({
      status: 'success',
      results: items.length,
      data: {
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get item by ID
 * @route GET /api/v1/items/:id
 * @access Public
 */
export const getItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id).populate([
      { path: 'category', select: 'name' },
      { path: 'seller', select: 'name email' },
      { path: 'buyer', select: 'name email' }
    ]);
    
    if (!item) {
      return next(new ApiError(404, 'Item not found'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        item
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new item
 * @route POST /api/v1/items
 * @access Private
 */
export const createItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Set seller to current user
    req.body.seller = req.user._id;
    
    const newItem = await Item.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        item: newItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update item
 * @route PATCH /api/v1/items/:id
 * @access Private
 */
export const updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return next(new ApiError(404, 'Item not found'));
    }
    
    // Check if user is the seller or an admin
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'You do not have permission to update this item'));
    }
    
    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        item: updatedItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete item
 * @route DELETE /api/v1/items/:id
 * @access Private
 */
export const deleteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return next(new ApiError(404, 'Item not found'));
    }
    
    // Check if user is the seller or an admin
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'You do not have permission to delete this item'));
    }
    
    await Item.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reserve an item
 * @route PATCH /api/v1/items/:id/reserve
 * @access Private
 */
export const reserveItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return next(new ApiError(404, 'Item not found'));
    }
    
    // Check if item is already reserved or sold
    if (item.status !== ItemStatus.AVAILABLE) {
      return next(new ApiError(400, `Item is already ${item.status}`));
    }
    
    // Set reservation details
    const reservationDays = req.body.reservationDays || 3; // Default 3 days
    const reservedUntil = new Date();
    reservedUntil.setDate(reservedUntil.getDate() + reservationDays);
    
    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        status: ItemStatus.RESERVED,
        buyer: req.user._id,
        reservedUntil
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        item: updatedItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel reservation
 * @route PATCH /api/v1/items/:id/cancel-reservation
 * @access Private
 */
export const cancelReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return next(new ApiError(404, 'Item not found'));
    }
    
    // Check if item is reserved
    if (item.status !== ItemStatus.RESERVED) {
      return next(new ApiError(400, 'Item is not reserved'));
    }
    
    // Check if user is the buyer, seller, or an admin
    if (
      item.buyer?.toString() !== req.user._id.toString() &&
      item.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new ApiError(403, 'You do not have permission to cancel this reservation'));
    }
    
    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        status: ItemStatus.AVAILABLE,
        buyer: null,
        reservedUntil: null
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        item: updatedItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark item as sold
 * @route PATCH /api/v1/items/:id/mark-sold
 * @access Private
 */
export const markItemAsSold = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return next(new ApiError(404, 'Item not found'));
    }
    
    // Check if user is the seller or an admin
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'You do not have permission to mark this item as sold'));
    }
    
    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        status: ItemStatus.SOLD,
        buyer: req.body.buyer || item.buyer,
        reservedUntil: null
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        item: updatedItem
      }
    });
  } catch (error) {
    next(error);
  }
}; 