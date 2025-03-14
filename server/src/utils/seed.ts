import { User, UserRole } from '../models/user.model';
import { Category } from '../models/category.model';
import { config } from '../config/env';
import { logger } from './logger';
import bcrypt from 'bcryptjs';

/**
 * Seed the database with initial data
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    // Create admin user if it doesn't exist
    const adminEmail = config.adminEmail || 'admin@example.com';
    const adminPassword = config.adminPassword || 'Admin123!';
    
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      logger.info(`Creating admin user with email: ${adminEmail}`);
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN
      });
      
      logger.info('Admin user created successfully');
    } else {
      logger.info('Admin user already exists');
    }
    
    // Create default categories if they don't exist
    const defaultCategories = (config.defaultCategories || 'Electronics,Furniture,Clothing,Books,Sports,Toys,Home Appliances,Other').split(',');
    
    for (const categoryName of defaultCategories) {
      const exists = await Category.findOne({ name: categoryName });
      
      if (!exists) {
        await Category.create({
          name: categoryName,
          description: `${categoryName} items`
        });
        
        logger.info(`Category '${categoryName}' created successfully`);
      } else {
        logger.info(`Category '${categoryName}' already exists`);
      }
    }
    
    logger.info('Database seeding completed');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
}; 