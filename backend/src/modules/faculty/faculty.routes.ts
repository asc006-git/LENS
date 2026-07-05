import { Router, Request, Response, NextFunction } from 'express';
import FacultyService from './faculty.service';
import { sendSuccess } from '../../common/utils/response';

const router = Router();

router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.getDashboard(req.user!._id.toString());
    sendSuccess(res, 'Faculty dashboard retrieved', data);
  } catch (error) {
    next(error);
  }
});

router.get('/courses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await FacultyService.getFacultyCourses(req.user!._id.toString());
    sendSuccess(res, 'Courses retrieved', courses);
  } catch (error) {
    next(error);
  }
});

router.get('/courses/:courseId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const detail = await FacultyService.getFacultyCourseDetail(req.user!._id.toString(), req.params.courseId);
    sendSuccess(res, 'Course detail retrieved', detail);
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
    sendSuccess(res, 'Reports retrieved', dashboard);
  } catch (error) {
    next(error);
  }
});

router.get('/interventions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const interventions = await FacultyService.getInterventions(req.user!._id.toString());
    sendSuccess(res, 'Interventions retrieved', interventions);
  } catch (error) {
    next(error);
  }
});

router.post('/interventions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const intervention = await FacultyService.createIntervention(req.user!._id.toString(), req.body);
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
