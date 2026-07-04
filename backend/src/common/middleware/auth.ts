import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { AuthenticationError } from '../errors';
import { IJwtPayload } from '../types';
import User from '../../modules/users/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: any;
        email: string;
        role: string;
        name: string;
      };
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as IJwtPayload;

    const user = await User.findById(decoded.userId).select('_id email role name');

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError('Token expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else {
      next(new AuthenticationError('Authentication failed'));
    }
  }
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.jwt.secret) as IJwtPayload;

    const user = await User.findById(decoded.userId).select('_id email role name');

    if (user) {
      req.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
    }

    next();
  } catch (error) {
    next();
  }
};
