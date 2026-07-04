import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors';
import { sendError } from '../utils/response';
import logger from '../utils/logger';
import mongoose from 'mongoose';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack, path: req.path, method: req.method });

  if (err instanceof ValidationError) {
    sendError(res, err.message, err.statusCode, err.errors, err.code);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, undefined, err.code);
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    sendError(res, `Invalid ${err.path}: ${err.value}`, 400, undefined, 'INVALID_ID');
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string[]> = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = [err.errors[key].message];
    });
    sendError(res, 'Validation failed', 400, errors, 'VALIDATION_ERROR');
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401, undefined, 'INVALID_TOKEN');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401, undefined, 'TOKEN_EXPIRED');
    return;
  }

  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    sendError(res, `Duplicate value for field: ${field}`, 409, undefined, 'DUPLICATE_VALUE');
    return;
  }

  sendError(res, 'Internal server error', 500, undefined, 'INTERNAL_SERVER_ERROR');
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404, undefined, 'NOT_FOUND');
};
