import { Router, Request, Response, NextFunction } from 'express';
import ReflectionService from './reflection.service';
import { sendSuccess } from '../../common/utils/response';

const router = Router();

router.get('/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reflection = await ReflectionService.getReflection(req.params.sessionId, req.user!._id.toString());
    sendSuccess(res, 'Reflection retrieved', reflection);
  } catch (error) {
    next(error);
  }
});

export default router;
