import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User, { IUser } from '../users/user.model';
import { config } from '../../config';
import { AuthenticationError, ConflictError, NotFoundError, AppError } from '../../common/errors';
import { IJwtPayload } from '../../common/types';
import { UserRole } from '../../common/enums';
import { getRedisClient } from '../../config/redis';

// Fallback in-memory store when Redis is not available
const memStore = new Map<string, string>();

function getStore(): { get(key: string): Promise<string | null>; setex(key: string, ttl: number, value: string): Promise<any>; del(key: string): Promise<any> } {
  const redis = getRedisClient();
  if (redis) {
    return {
      get: (key: string) => redis.get(key),
      setex: (key: string, ttl: number, value: string) => redis.setex(key, ttl, value) as any,
      del: (key: string) => redis.del(key) as any,
    };
  }
  // In-memory fallback
  return {
    get: async (key: string) => memStore.get(key) || null,
    setex: async (key: string, _ttl: number, value: string) => { memStore.set(key, value); },
    del: async (key: string) => { memStore.delete(key); },
  };
}

export class AuthService {
  private static generateAccessToken(payload: IJwtPayload): string {
    return jwt.sign(payload as object, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });
  }

  private static generateRefreshToken(payload: IJwtPayload): string {
    return jwt.sign({ ...payload, jti: uuidv4() } as object, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as any,
    });
  }

  static async register(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    institution?: string;
    department?: string;
  }) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || UserRole.STUDENT,
      institution: data.institution,
      department: data.department,
    });

    const jwtPayload: IJwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    user.refreshToken = refreshToken;
    await user.save();

    const store = getStore();
    await store.setex(`refresh_token:${user._id}`, 7 * 24 * 60 * 60, refreshToken);

    return { user, accessToken, refreshToken };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new AuthenticationError('Account is not active');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    const jwtPayload: IJwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    const store = getStore();
    await store.setex(`refresh_token:${user._id}`, 7 * 24 * 60 * 60, refreshToken);

    return { user, accessToken, refreshToken };
  }

  static async logout(userId: string): Promise<void> {
    const store = getStore();
    await store.del(`refresh_token:${userId}`);
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }

  static async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as IJwtPayload & { jti: string };

      const store = getStore();
      const storedToken = await store.get(`refresh_token:${decoded.userId}`);

      if (storedToken !== token) {
        throw new AuthenticationError('Invalid refresh token');
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      if (user.status !== 'active') {
        throw new AuthenticationError('Account is not active');
      }

      const jwtPayload: IJwtPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const newAccessToken = this.generateAccessToken(jwtPayload);
      const newRefreshToken = this.generateRefreshToken(jwtPayload);

      user.refreshToken = newRefreshToken;
      await user.save();

      await store.del(`refresh_token:${decoded.userId}`);
      await store.setex(`refresh_token:${user._id}`, 7 * 24 * 60 * 60, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Refresh token expired');
      }
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) return;

    const resetToken = jwt.sign({ userId: user._id } as object, config.jwt.secret, { expiresIn: '1h' } as any);
    const store = getStore();
    await store.setex(`password_reset:${user._id}`, 3600, resetToken);
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as IJwtPayload;
      const store = getStore();
      const storedToken = await store.get(`password_reset:${decoded.userId}`);

      if (storedToken !== token) {
        throw new AppError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
      }

      const user = await User.findById(decoded.userId);
      if (!user) throw new NotFoundError('User');

      user.password = newPassword;
      user.refreshToken = undefined;
      await user.save();

      await store.del(`password_reset:${decoded.userId}`);
      await store.del(`refresh_token:${decoded.userId}`);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Reset token expired', 400, 'RESET_TOKEN_EXPIRED');
      }
      throw error;
    }
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User');
    return user;
  }
}

export default AuthService;
