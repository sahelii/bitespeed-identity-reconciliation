// Test setup file
import dotenv from 'dotenv';

// Load environment variables for tests
dotenv.config({ path: '.env.test' });

// Set test port to avoid conflicts with running app
process.env['PORT'] = '3001';

// Global test timeout
jest.setTimeout(10000); 