import { Router, Request, Response, NextFunction } from 'express';
import ReportService from './report.service';
import { sendSuccess } from '../../common/utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await import('../learning/learning-session.model').then(m =>
      m.default.find({ student: req.user!._id.toString(), status: 'completed' }).sort({ updatedAt: -1 })
    );
    const reports = sessions.map(s => ({
      sessionId: s._id,
      learningObjective: s.learningObjective,
      report: s.report,
      updatedAt: s.updatedAt,
    }));
    sendSuccess(res, 'Reports retrieved', reports);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await ReportService.getReport(req.params.id, req.user!._id.toString());
    sendSuccess(res, 'Report retrieved', report);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const format = (req.query.format as string) || 'json';
    const data = await ReportService.exportReport(req.params.id, req.user!._id.toString(), format);
    sendSuccess(res, 'Report exported', data);
  } catch (error) {
    next(error);
  }
});

router.post('/share', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, shareWith } = req.body;
    const result = await ReportService.shareReport(sessionId, req.user!._id.toString(), shareWith);
    sendSuccess(res, 'Report shared', result);
  } catch (error) {
    next(error);
  }
});

export default router;
