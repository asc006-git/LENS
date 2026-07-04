import { Router, Request, Response, NextFunction } from 'express';
import AchievementService from './achievement.service';
import { sendSuccess } from '../../common/utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const achievements = await AchievementService.getAchievements(req.user!._id.toString());
    sendSuccess(res, 'Achievements retrieved', achievements);
  } catch (error) {
    next(error);
  }
});

router.post('/evaluate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newAchievements = await AchievementService.evaluateAchievements(req.user!._id.toString());
    sendSuccess(res, 'Achievements evaluated', newAchievements);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/claim', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const achievement = await AchievementService.claimAchievement(req.user!._id.toString(), req.params.id);
    sendSuccess(res, 'Achievement claimed', achievement);
  } catch (error) {
    next(error);
  }
});

export default router;
