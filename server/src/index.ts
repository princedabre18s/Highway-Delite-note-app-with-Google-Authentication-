import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Load environment variables - try multiple paths
const envPath1 = path.join(__dirname, '../.env');
const envPath2 = path.join(__dirname, '../../.env');
const envPath3 = '.env';

console.log('Trying .env paths:');
console.log('Path 1:', envPath1);
console.log('Path 2:', envPath2);
console.log('Path 3:', envPath3);

// Try loading .env file
dotenv.config({ path: envPath1 });
dotenv.config({ path: envPath2 });
dotenv.config({ path: envPath3 });

// Manually set SMTP variables for testing if not loaded
if (!process.env.SMTP_EMAIL) {
  console.log('Setting SMTP variables manually for testing...');
  process.env.SMTP_EMAIL = '9809.crce@gmail.com';
  process.env.SMTP_PASSWORD = 'wbaw onqy vwvo bdqt';
  process.env.SMTP_HOST = 'smtp.gmail.com';
  process.env.SMTP_PORT = '587';
}

import authRoutes from './routes/auth';
import noteRoutes from './routes/notes';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting (fixes X-Forwarded-For warning)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
