import { Router, Request, Response, NextFunction } from 'express';
import DashboardService from './dashboard.service';
import { sendSuccess } from '../../common/utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboard = await DashboardService.getStudentDashboard(req.user!._id.toString());
    sendSuccess(res, 'Dashboard retrieved', dashboard);
  } catch (error) {
    next(error);
  }
});

export default router;
