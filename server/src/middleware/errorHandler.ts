import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@/middleware/customError.js';

/**
 * Error-handler middleware
 * ------------------------
 * Tar emot ett felobjekt (err) tillsammans med Express' request, response
 * och next-funktion. Fångar upp alla fel som skickas vidare genom next(error).
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Loggar ut felinformation på servern för felsökning
  console.error({
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
  });

  /**
   * Om vårt felobjekt har en statuskod, använd den.
   * Annars sätts statusCode till 500 (Internal Server Error).
   */
  const statusCode = err.status || 500;

  /**
   * Skilj på 'development' och övriga miljöer (ex. 'production').
   * I utvecklingsmiljö skickar vi med mer detaljer (stack-trace).
   */
  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      error: err.message,
      stack: err.stack,
    });
  } else {
    // I produktion skickar vi inte ut stack-trace till klienten av säkerhetsskäl
    res.status(statusCode).json({
      error: statusCode === 500 ? 'Internal server error' : err.message,
    });
  }
};
