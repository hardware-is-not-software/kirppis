import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import { User, UserRole } from '../models/user.model';

/**
 * Script to create a new admin user
 */
const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at: ${config.mongoUri}`);
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected');

    // Admin user details
    const adminEmail = config.adminEmail || 'admin@example.com';
    const adminPassword = config.adminPassword || 'Admin123!';
    
    // Check if admin user already exists
    console.log(`Checking if admin user with email ${adminEmail} already exists`);
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists, deleting it first');
      await User.deleteOne({ email: adminEmail });
      console.log('Existing admin user deleted');
    }
    
    // Create new admin user
    console.log('Creating new admin user');
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    const newAdmin = new User({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN
    });
    
    await newAdmin.save();
    console.log('New admin user created successfully');
    
    // Test password comparison
    console.log('Testing password comparison...');
    const isMatch = await bcrypt.compare(adminPassword, newAdmin.password);
    console.log('Password match result:', isMatch);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser(); 