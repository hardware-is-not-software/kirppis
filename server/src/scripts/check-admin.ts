import mongoose from 'mongoose';
import { config } from '../config/env';
import { User } from '../models/user.model';

/**
 * Script to check the admin user in the database
 */
const checkAdminUser = async () => {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at: ${config.mongoUri}`);
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected');

    // Find admin user
    const adminEmail = config.adminEmail || 'admin@example.com';
    
    console.log(`Looking for admin user with email: ${adminEmail}`);
    const adminUser = await User.findOne({ email: adminEmail }).select('+password');
    
    if (!adminUser) {
      console.error('Admin user not found');
      process.exit(1);
    }
    
    console.log('Admin user found:');
    console.log('ID:', adminUser._id);
    console.log('Name:', adminUser.name);
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('Password (hashed):', adminUser.password);
    console.log('Created At:', adminUser.createdAt);
    console.log('Updated At:', adminUser.updatedAt);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin user:', error);
    process.exit(1);
  }
};

// Run the script
checkAdminUser(); 