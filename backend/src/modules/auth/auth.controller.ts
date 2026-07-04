import { Request, Response, NextFunction } from 'express';
import AuthService from './auth.service';
import { sendSuccess } from '../../common/utils/response';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, role, institution, department } = req.body;
      const result = await AuthService.register({ name, email, password, role, institution, department });
      sendSuccess(res, 'Registration successful', result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      sendSuccess(res, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new Error('Not authenticated');
      }
      await AuthService.logout(req.user._id.toString());
      sendSuccess(res, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      sendSuccess(res, 'Token refreshed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      sendSuccess(res, 'If the email exists, a reset link has been sent');
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword(token, password);
      sendSuccess(res, 'Password reset successful');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new Error('Not authenticated');
      }
      const user = await AuthService.getMe(req.user._id.toString());
      sendSuccess(res, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
