import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import { User, UserRole } from '../models/user.model';

/**
 * Script to debug password hashing and comparison
 */
const debugPassword = async () => {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at: ${config.mongoUri}`);
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected');

    // Admin user details
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin123!';
    
    console.log('Testing password hashing and comparison directly with bcrypt');
    
    // Hash the password directly with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    console.log('Password:', adminPassword);
    console.log('Hashed password:', hashedPassword);
    
    // Compare the password directly with bcrypt
    const isMatch = await bcrypt.compare(adminPassword, hashedPassword);
    console.log('Password match result with direct bcrypt comparison:', isMatch);
    
    // Create a test user directly in the database
    console.log('\nCreating a test user directly in the database');
    
    // First, delete the test user if it exists
    await User.deleteOne({ email: 'test@example.com' });
    
    // Create a new test user
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: adminPassword, // Use the plain password and let the pre-save hook hash it
      role: UserRole.USER
    });
    console.log('Test user created');
    
    // Retrieve the test user
    const retrievedUser = await User.findOne({ email: 'test@example.com' }).select('+password');
    console.log('Retrieved test user password:', retrievedUser?.password);
    
    // Test password comparison with the User model method
    const isMatchWithMethod = await retrievedUser?.comparePassword(adminPassword);
    console.log('Password match result with User model method:', isMatchWithMethod);
    
    // Now create the admin user properly
    console.log('\nCreating admin user properly');
    
    // First, delete the admin user if it exists
    await User.deleteOne({ email: adminEmail });
    
    // Create a new admin user
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword, // Use the plain password and let the pre-save hook hash it
      role: UserRole.ADMIN
    });
    console.log('Admin user created');
    
    // Retrieve the admin user
    const adminUser = await User.findOne({ email: adminEmail }).select('+password');
    console.log('Retrieved admin user password:', adminUser?.password);
    
    // Test password comparison with the User model method
    const adminPasswordMatch = await adminUser?.comparePassword(adminPassword);
    console.log('Admin password match result with User model method:', adminPasswordMatch);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('Error debugging password:', error);
    process.exit(1);
  }
};

// Run the script
debugPassword(); 