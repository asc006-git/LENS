import { Router, Request, Response, NextFunction } from 'express';
import RecommendationService from './recommendation.service';
import { sendSuccess } from '../../common/utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await import('../learning/learning-session.model').then(m =>
      m.default.find({ student: req.user!._id.toString(), status: 'completed' }).sort({ updatedAt: -1 })
    );
    const recommendations = sessions
      .filter(s => s.guidedLearning && s.guidedLearning.activities?.length > 0)
      .map(s => ({
        sessionId: s._id,
        learningObjective: s.learningObjective,
        guidedLearning: s.guidedLearning,
      }));
    sendSuccess(res, 'Recommendations retrieved', recommendations);
  } catch (error) {
    next(error);
  }
});

router.get('/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recommendations = await RecommendationService.getRecommendations(req.params.sessionId, req.user!._id.toString());
    sendSuccess(res, 'Recommendations retrieved', recommendations);
  } catch (error) {
    next(error);
  }
});

router.post('/:sessionId/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activityIndex } = req.body;
    const result = await RecommendationService.completeActivity(req.params.sessionId, req.user!._id.toString(), activityIndex);
    sendSuccess(res, 'Activity completed', result);
  } catch (error) {
    next(error);
  }
});

router.post('/regenerate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, focusAreas } = req.body;
    const result = await RecommendationService.regenerate(sessionId, req.user!._id.toString(), focusAreas);
    sendSuccess(res, 'Recommendations regenerated', result);
  } catch (error) {
    next(error);
  }
});

export default router;
