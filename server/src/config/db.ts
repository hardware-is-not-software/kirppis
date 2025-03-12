import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../utils/logger';

/**
 * Connect to MongoDB database
 */
export const connectDB = async (): Promise<void> => {
  try {
    logger.info(`Attempting to connect to MongoDB at: ${config.mongoUri}`);
    const conn = await mongoose.connect(config.mongoUri);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle MongoDB connection events
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
      console.error('MongoDB connection error details:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
    console.error('MongoDB connection error details:', error);
    throw error; // Re-throw to be caught by the caller
  }
}; 