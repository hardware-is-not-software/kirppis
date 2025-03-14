import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Environment variables with defaults
export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  host: process.env.HOST || 'localhost',
  
  // MongoDB connection
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/kirppis',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  
  // CORS configuration
  corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173',
  
  // Logging
  enableLogging: process.env.ENABLE_LOGGING !== 'false',
  logLevel: process.env.LOG_LEVEL || 'info',

  // Admin user
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin123!',

  // Default categories
  defaultCategories: process.env.DEFAULT_CATEGORIES || 'Electronics,Furniture,Clothing,Books,Sports,Toys,Home Appliances,Other',
};

// Validate required environment variables in production
if (config.nodeEnv === 'production') {
  const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is required in production mode`);
    }
  }
  
  // Ensure JWT secret is not the default in production
  if (config.jwtSecret === 'your-secret-key') {
    throw new Error('JWT_SECRET must be changed from the default value in production');
  }
} 