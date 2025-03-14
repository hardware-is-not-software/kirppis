import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config/env';
import { connectDB } from './config/db';
import { setupLogger, logger } from './utils/logger';
import { errorHandler } from './middlewares/error.middleware';
import routes from './routes';
import { seedDatabase } from './utils/seed';

// Initialize logger
setupLogger();

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadDir));

// Logging
if (config.enableLogging) {
  app.use(morgan('combined', { stream: { write: message => logger.http(message.trim()) } }));
}

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Kirppis API',
    version: 'v1',
    documentation: '/api/v1/docs',
    healthCheck: '/api/v1/health'
  });
});

// API Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port;
const HOST = config.host;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Seed the database with initial data
    await seedDatabase();
    
    // Add global unhandled exception handlers
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      console.error('Uncaught Exception details:', error);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      console.error('Unhandled Rejection details:', reason);
    });
    
    app.listen(PORT, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('Error details:', error);
    process.exit(1);
  }
};

startServer(); 