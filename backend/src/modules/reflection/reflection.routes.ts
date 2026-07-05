import { Router, Request, Response, NextFunction } from 'express';
import ReflectionService from './reflection.service';
import { sendSuccess } from '../../common/utils/response';

const router = Router();

// GET /api/v1/reflection
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reflections = await ReflectionService.getAllReflections(req.user!._id.toString());
    sendSuccess(res, 'Reflections retrieved', reflections);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/reflection/:sessionId
router.get('/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reflection = await ReflectionService.getReflection(req.params.sessionId, req.user!._id.toString());
    sendSuccess(res, 'Reflection retrieved', reflection);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/reflection/:sessionId/sections/:sectionId
router.put('/:sessionId/sections/:sectionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const reflection = await ReflectionService.updateReflectionSection(
      req.params.sessionId,
      req.user!._id.toString(),
      req.params.sectionId,
      content
    );
    sendSuccess(res, 'Reflection section updated', reflection);
  } catch (error) {
    next(error);
  }
});

export default router;
