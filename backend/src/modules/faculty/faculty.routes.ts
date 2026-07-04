import { Router, Request, Response, NextFunction } from 'express';
import FacultyService from './faculty.service';
import { sendSuccess } from '../../common/utils/response';

const router = Router();

router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboard = await FacultyService.getDashboard(req.user!._id.toString());
    sendSuccess(res, 'Faculty dashboard retrieved', dashboard);
  } catch (error) {
    next(error);
  }
});

router.get('/courses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboard = await FacultyService.getDashboard(req.user!._id.toString());
    sendSuccess(res, 'Courses retrieved', dashboard.recentSessions);
  } catch (error) {
    next(error);
  }
});

router.get('/courses/:courseId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analytics = await FacultyService.getCourseAnalytics(req.user!._id.toString(), req.params.courseId);
    sendSuccess(res, 'Course analytics retrieved', analytics);
  } catch (error) {
    next(error);
  }
});

router.get('/students', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboard = await FacultyService.getDashboard(req.user!._id.toString());
    sendSuccess(res, 'Students retrieved', dashboard);
  } catch (error) {
    next(error);
  }
});

router.get('/students/:studentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const intelligence = await FacultyService.getStudentIntelligence(req.user!._id.toString(), req.params.studentId);
    sendSuccess(res, 'Student intelligence retrieved', intelligence);
  } catch (error) {
    next(error);
  }
});

router.get('/students/:studentId/journey', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const journey = await FacultyService.getStudentJourney(req.user!._id.toString(), req.params.studentId);
    sendSuccess(res, 'Student journey retrieved', journey);
  } catch (error) {
    next(error);
  }
});

router.get('/analytics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recommendations = await FacultyService.getTeachingRecommendations(req.user!._id.toString());
    sendSuccess(res, 'Analytics retrieved', recommendations);
  } catch (error) {
    next(error);
  }
});

router.get('/insights', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recommendations = await FacultyService.getTeachingRecommendations(req.user!._id.toString());
    sendSuccess(res, 'Insights retrieved', recommendations);
  } catch (error) {
    next(error);
  }
});

router.get('/reports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboard = await FacultyService.getDashboard(req.user!._id.toString());
    sendSuccess(res, 'Reports retrieved', dashboard.stats);
  } catch (error) {
    next(error);
  }
});

router.get('/interventions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, 'Interventions retrieved', []);
  } catch (error) {
    next(error);
  }
});

router.post('/interventions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId, type, message, concepts } = req.body;
    const intervention = await FacultyService.createIntervention(req.user!._id.toString(), studentId, { type, message, concepts });
    sendSuccess(res, 'Intervention created', intervention, 201);
  } catch (error) {
    next(error);
  }
});

router.get('/impact', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startDate = new Date(req.query.startDate as string || Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date(req.query.endDate as string || Date.now());
    const impact = await FacultyService.getImpact(req.user!._id.toString(), startDate, endDate);
    sendSuccess(res, 'Impact data retrieved', impact);
  } catch (error) {
    next(error);
  }
});

export default router;
