import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Unhandled Application Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  return sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};
