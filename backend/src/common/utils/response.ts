import { Response } from 'express';
import { PaginatedResult } from '../types';

interface SuccessResponse {
  success: true;
  message: string;
  data?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: any;
  code?: string;
}

export const sendSuccess = (res: Response, message: string, data?: any, statusCode: number = 200, meta?: any): void => {
  const response: SuccessResponse = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (meta) {
    response.meta = meta;
  }

  res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, statusCode: number = 500, error?: any, code?: string): void => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error.message || error;
  }

  if (code) {
    response.code = code;
  }

  res.status(statusCode).json(response);
};

export const sendPaginated = (
  res: Response,
  message: string,
  data: any[],
  page: number,
  limit: number,
  total: number
): void => {
  const totalPages = Math.ceil(total / limit);

  const response: SuccessResponse = {
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };

  res.status(200).json(response);
};
