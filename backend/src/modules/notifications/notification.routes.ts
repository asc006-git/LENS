import { Router, Request, Response, NextFunction } from 'express';
import NotificationService from './notification.service';
import { sendSuccess } from '../../common/utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await NotificationService.getNotifications(req.user!._id.toString(), page, limit);
    sendSuccess(res, 'Notifications retrieved', result.notifications, 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/unread-count', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user!._id.toString());
    sendSuccess(res, 'Unread count retrieved', { count });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await NotificationService.markAsRead(req.params.id, req.user!._id.toString());
    sendSuccess(res, 'Notification marked as read', notification);
  } catch (error) {
    next(error);
  }
});

router.put('/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationService.markAllAsRead(req.user!._id.toString());
    sendSuccess(res, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationService.deleteNotification(req.params.id, req.user!._id.toString());
    sendSuccess(res, 'Notification deleted');
  } catch (error) {
    next(error);
  }
});

export default router;
