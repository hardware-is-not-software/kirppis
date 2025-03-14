import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import { User } from '../models/user.model';

/**
 * Script to reset the admin password
 */
const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at: ${config.mongoUri}`);
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected');

    // Find admin user
    const adminEmail = config.adminEmail || 'admin@example.com';
    const adminPassword = config.adminPassword || 'Admin123!';
    
    console.log(`Looking for admin user with email: ${adminEmail}`);
    const adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      console.error('Admin user not found');
      process.exit(1);
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Update the admin password
    adminUser.password = hashedPassword;
    await adminUser.save();
    
    console.log('Admin password reset successfully');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin password:', error);
    process.exit(1);
  }
};

// Run the script
resetAdminPassword(); 