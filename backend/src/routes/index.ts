import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import learningSessionRoutes from '../modules/learning/learning-session.routes';
import courseRoutes from '../modules/course/course.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import reportRoutes from '../modules/reports/report.routes';
import portfolioRoutes from '../modules/portfolio/portfolio.routes';
import achievementRoutes from '../modules/achievements/achievement.routes';
import recommendationRoutes from '../modules/recommendations/recommendation.routes';
import notificationRoutes from '../modules/notifications/notification.routes';
import facultyRoutes from '../modules/faculty/faculty.routes';
import reflectionRoutes from '../modules/reflection/reflection.routes';
import mentorRoutes from '../modules/mentor/mentor.routes';
import { authenticate } from '../common/middleware/auth';

const router = Router();

router.use('/auth', authRoutes);
router.use('/learning-sessions', learningSessionRoutes);
router.use('/courses', courseRoutes);

router.use('/dashboard', authenticate, dashboardRoutes);
router.use('/reports', authenticate, reportRoutes);
router.use('/portfolio', authenticate, portfolioRoutes);
router.use('/achievements', authenticate, achievementRoutes);
router.use('/recommendations', authenticate, recommendationRoutes);
router.use('/notifications', authenticate, notificationRoutes);
router.use('/faculty', authenticate, facultyRoutes);
router.use('/reflection', authenticate, reflectionRoutes);
router.use('/mentor', mentorRoutes);

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
