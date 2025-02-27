import rateLimit from 'express-rate-limit';

// Rate limiter middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuter
  max: 100, // max 100 requests per fönster
  message: 'Too many requests, try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
