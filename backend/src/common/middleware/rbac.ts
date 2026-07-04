import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../errors';
import { UserRole } from '../enums';

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthorizationError('Authentication required'));
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(new AuthorizationError(`Role '${req.user.role}' is not authorized to access this resource`));
    }

    next();
  };
};

export const isOwner = (getResourceOwnerId: (req: Request) => Promise<string | null>) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new AuthorizationError('Authentication required'));
      }

      const ownerId = await getResourceOwnerId(req);

      if (!ownerId) {
        return next(new AuthorizationError('Resource not found'));
      }

      if (req.user.role === UserRole.SYSTEM_ADMIN || req.user.role === UserRole.INSTITUTION_ADMIN) {
        return next();
      }

      if (ownerId.toString() !== req.user._id.toString()) {
        return next(new AuthorizationError('You do not have permission to access this resource'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
