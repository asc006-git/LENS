import { config } from './index';
import { logger } from '../common/utils/logger';

// Completely optional Redis - use only if available
let redisClient: any = null;

export const connectRedis = async (): Promise<any> => {
  // Skip Redis entirely - use in-memory fallback
  logger.warn('Redis skipped, using in-memory token store');
  redisClient = null;
  return null;
};

export const getRedisClient = (): any => {
  return null;
};

export const disconnectRedis = async (): Promise<void> => {
  redisClient = null;
};
