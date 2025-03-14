import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import { User } from '../models/user.model';

/**
 * Script to test the password comparison
 */
const testPasswordComparison = async () => {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at: ${config.mongoUri}`);
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected');

    // Find admin user
    const adminEmail = config.adminEmail || 'admin@example.com';
    const adminPassword = config.adminPassword || 'Admin123!';
    
    console.log(`Looking for admin user with email: ${adminEmail}`);
    const adminUser = await User.findOne({ email: adminEmail }).select('+password');
    
    if (!adminUser) {
      console.error('Admin user not found');
      process.exit(1);
    }
    
    console.log('Admin user found');
    console.log('Testing password comparison...');
    
    // Test password comparison directly with bcrypt
    const isMatch = await bcrypt.compare(adminPassword, adminUser.password);
    console.log('Password match result:', isMatch);
    
    // Test password comparison with the User model method
    const isMatchWithMethod = await adminUser.comparePassword(adminPassword);
    console.log('Password match result with User model method:', isMatchWithMethod);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing password comparison:', error);
    process.exit(1);
  }
};

// Run the script
testPasswordComparison(); 