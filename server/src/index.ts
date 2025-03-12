import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { connectDB } from './config/db';
import { setupLogger, logger } from './utils/logger';
import { errorHandler } from './middlewares/error.middleware';
import routes from './routes';

// Initialize logger
setupLogger();

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins.split(','),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.enableLogging) {
  app.use(morgan('combined', { stream: { write: message => logger.http(message.trim()) } }));
}

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
    
    app.listen(PORT, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 