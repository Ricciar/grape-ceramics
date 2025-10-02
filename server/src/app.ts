import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import storeRoutes from './routes/storeRoutes.js';
import pageRoutes from './routes/pageRoutes.js';

const app = express();

// CORS configuration basen on environment
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api', storeRoutes); // Woo Commerce
app.use('/api/pages', pageRoutes); // WorPress sidor

app.use((req, res, next) => {
  console.log('INCOMING EXPRESS:', req.method, req.url, req.originalUrl);
  next();
});

// Catch-all route för odefinierade endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Nor Found',
    message: `Route ${req.originalUrl} does not exist`,
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
