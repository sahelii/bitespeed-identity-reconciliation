import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { identifyRouter } from './routes/identify';
import { healthRouter } from './routes/health';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRouter);
app.use('/identify', identifyRouter);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Only start the server if this is the main module
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env['NODE_ENV'] || 'development'}`);
  });
}

export default app; 