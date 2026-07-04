import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { connectDatabase } from './config/database';
import { connectRedis, disconnectRedis } from './config/redis';
import { errorHandler, notFoundHandler } from './common/middleware/errorHandler';
import routes from './routes';
import logger from './common/utils/logger';

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.frontend.url,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(helmet());
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/api/v1', routes);

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join_session', (sessionId: string) => {
    socket.join(`session:${sessionId}`);
    logger.info(`Client ${socket.id} joined session ${sessionId}`);
  });

  socket.on('leave_session', (sessionId: string) => {
    socket.leave(`session:${sessionId}`);
    logger.info(`Client ${socket.id} left session ${sessionId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

app.set('io', io);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    // Try to connect to Redis but don't fail if unavailable
    try {
      await connectRedis();
    } catch (e) {
      logger.warn('Redis unavailable, continuing without cache');
    }

    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });
  await disconnectRedis();
  process.exit(0);
});

export { app, io };
export default startServer;

startServer();
