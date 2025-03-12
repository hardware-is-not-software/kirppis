import mongoose, { Document, Schema } from 'mongoose';

// Item status enum
export enum ItemStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold'
}

// Item condition enum
export enum ItemCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

// Item interface
export interface IItem extends Document {
  title: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  condition: ItemCondition;
  status: ItemStatus;
  images: string[];
  seller: mongoose.Types.ObjectId;
  buyer?: mongoose.Types.ObjectId;
  reservedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Item schema
const itemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category']
    },
    condition: {
      type: String,
      enum: Object.values(ItemCondition),
      required: [true, 'Please provide the item condition']
    },
    status: {
      type: String,
      enum: Object.values(ItemStatus),
      default: ItemStatus.AVAILABLE
    },
    images: {
      type: [String],
      default: []
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a seller']
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reservedUntil: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for better query performance
itemSchema.index({ title: 'text', description: 'text' });
itemSchema.index({ category: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ seller: 1 });
itemSchema.index({ price: 1 });

// Create and export Item model
export const Item = mongoose.model<IItem>('Item', itemSchema); 