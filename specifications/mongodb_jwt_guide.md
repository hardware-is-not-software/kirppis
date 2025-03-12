# MongoDB and JWT Implementation Guide

This document provides guidelines and best practices for working with MongoDB and JSON Web Tokens (JWT) in the Kirppis application to avoid common issues and ensure smooth development.

## MongoDB Setup and Configuration

### Docker Configuration

The application uses MongoDB in a Docker container for both development and production. Here are key points to remember:

1. **Container Permissions**:
   - Do not specify a custom user in the Docker Compose file for the MongoDB service
   - MongoDB needs to run as its default user to have proper permissions to create directories and files

   ```yaml
   # Correct configuration in docker-compose.yml
   mongodb:
     image: mongo:latest
     ports:
       - "27017:27017"
     volumes:
       - mongodb_data:/data/db
     restart: unless-stopped
     # No user directive - let MongoDB use its default user
   ```

2. **Connection URI**:
   - For local development (outside Docker): `mongodb://localhost:27017/kirppis`
   - For services within Docker network: `mongodb://mongodb:27017/kirppis`
   - Always use the hostname that matches your context (localhost vs container name)

   ```
   # In .env file
   # When running the server directly on your machine:
   MONGO_URI=mongodb://localhost:27017/kirppis
   
   # When running the server inside Docker:
   MONGO_URI=mongodb://mongodb:27017/kirppis
   ```

3. **Volume Management**:
   - Use named volumes for data persistence
   - Avoid binding to host directories unless necessary for specific use cases

### Connection Handling

1. **Connection Setup**:
   - Use a dedicated module for database connection
   - Implement proper error handling and logging
   - Set up event listeners for connection events (connected, disconnected, error)

   ```typescript
   // Example from config/db.ts
   export const connectDB = async (): Promise<void> => {
     try {
       logger.info(`Attempting to connect to MongoDB at: ${config.mongoUri}`);
       const conn = await mongoose.connect(config.mongoUri);
       
       logger.info(`MongoDB Connected: ${conn.connection.host}`);
       
       // Handle MongoDB connection events
       mongoose.connection.on('error', (err) => {
         logger.error(`MongoDB connection error: ${err}`);
       });
       
       mongoose.connection.on('disconnected', () => {
         logger.warn('MongoDB disconnected');
       });
       
     } catch (error) {
       logger.error(`Error connecting to MongoDB: ${error}`);
       throw error;
     }
   };
   ```

2. **Testing Connections**:
   - Create simple test scripts to verify database connectivity
   - Use these scripts to troubleshoot connection issues

   ```javascript
   // Example test script (test-db.js)
   const mongoose = require('mongoose');

   async function testConnection() {
     try {
       console.log('Attempting to connect to MongoDB...');
       await mongoose.connect('mongodb://localhost:27017/kirppis');
       console.log('MongoDB connected successfully!');
       
       // Create a test document
       const Test = mongoose.model('Test', new mongoose.Schema({
         name: String,
         date: { type: Date, default: Date.now }
       }));
       
       const testDoc = new Test({ name: 'Test Document' });
       await testDoc.save();
       console.log('Test document saved successfully!');
       
       // Close the connection
       await mongoose.connection.close();
     } catch (error) {
       console.error('Error connecting to MongoDB:', error);
     }
   }

   testConnection();
   ```

## JWT Implementation

### TypeScript and JWT

When working with JWT in TypeScript, you may encounter type issues. Here's how to handle them:

1. **Proper Type Imports**:
   - Import the necessary types from the jsonwebtoken package
   
   ```typescript
   import jwt, { Secret, SignOptions } from 'jsonwebtoken';
   ```

2. **Type Assertions for JWT Sign Method**:
   - Use type assertions to satisfy TypeScript's type checking
   - This is especially important for the `expiresIn` parameter

   ```typescript
   // Example from user.model.ts
   userSchema.methods.generateAuthToken = function(): string {
     const payload = { id: this._id, role: this.role };
     
     return jwt.sign(
       payload, 
       config.jwtSecret as jwt.Secret, 
       { expiresIn: config.jwtExpiresIn as any }
     );
   };
   ```

3. **Environment Variables**:
   - Store JWT secret and expiration time in environment variables
   - Provide sensible defaults for development
   - Ensure proper validation in production

   ```typescript
   // Example from config/env.ts
   export const config = {
     // ... other config
     jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
     jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
   };
   
   // Validate in production
   if (config.nodeEnv === 'production') {
     if (config.jwtSecret === 'your-secret-key') {
       throw new Error('JWT_SECRET must be changed from the default value in production');
     }
   }
   ```

### JWT Best Practices

1. **Token Generation**:
   - Include only necessary data in the payload (user ID, role)
   - Set appropriate expiration time
   - Use a strong, unique secret key

2. **Token Verification**:
   - Implement proper error handling during verification
   - Check for token expiration
   - Validate user existence after token verification

3. **Security Considerations**:
   - Store JWT secret securely
   - Rotate secrets periodically in production
   - Consider using refresh tokens for long-lived sessions

## Troubleshooting Common Issues

### MongoDB Connection Issues

1. **Container Not Starting**:
   - Check Docker logs: `docker logs <container_name>`
   - Verify volume permissions
   - Ensure no conflicting MongoDB instances are running

2. **Connection Refused**:
   - Verify MongoDB is running: `docker ps`
   - Check the connection URI (hostname, port)
   - Ensure network connectivity between services

3. **Authentication Failures**:
   - Verify credentials if authentication is enabled
   - Check database and user existence

### JWT Issues

1. **TypeScript Errors**:
   - Use type assertions as shown above
   - Consider using the `--transpile-only` flag during development to bypass type checking

2. **Invalid Signature**:
   - Ensure the same secret is used for signing and verification
   - Check for environment variable inconsistencies

3. **Token Expiration**:
   - Verify the `expiresIn` parameter format
   - Implement proper error handling for expired tokens

## Development Workflow

1. **Local Development**:
   - Start MongoDB with `docker compose up -d mongodb`
   - Run the server with `npm run dev` or `npm run dev:ignore-ts`
   - Run the client with `cd client && npm run dev`

2. **Testing**:
   - Create simple test scripts for database operations
   - Use Postman or similar tools to test JWT authentication

3. **Debugging**:
   - Check server logs in the `logs` directory
   - Use Docker logs for container issues
   - Add debug logging for authentication and database operations

By following these guidelines, you can avoid common issues with MongoDB and JWT implementation in the Kirppis application. 