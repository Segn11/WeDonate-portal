import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (maxRequests: number, windowMinutes: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    // Clean up expired entries
    for (const [k, v] of requestCounts.entries()) {
      if (v.resetTime < now) {
        requestCounts.delete(k);
      }
    }

    // Get or create entry for this IP
    const entry = requestCounts.get(key);
    
    if (!entry || entry.resetTime < now) {
      // New window
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      return res.status(429).json({
        statusCode: 429,
        message: 'Too many requests. Please try again later.',
      });
    }

    // Increment count
    entry.count++;
    next();
  };
};
