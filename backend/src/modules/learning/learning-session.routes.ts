import { Router } from 'express';
import LearningSessionController from './learning-session.controller';
import { authenticate } from '../../common/middleware/auth';
import { validateBody, validateQuery } from '../../common/middleware/validate';
import {
  createSessionSchema,
  confirmBlueprintSchema,
  submitValidationResponseSchema,
  generateReflectionSchema,
  resumeSessionSchema,
  getSessionsQuerySchema,
} from './learning-session.validation';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createSessionSchema), LearningSessionController.createSession);
router.get('/', validateQuery(getSessionsQuerySchema), LearningSessionController.getStudentSessions);
router.get('/active', LearningSessionController.getActiveSession);
router.get('/:id', LearningSessionController.getSession);
router.post('/:id/upload', LearningSessionController.uploadFiles);
router.post('/:id/analyze', LearningSessionController.startAnalysis);
router.get('/:id/blueprint', LearningSessionController.getBlueprint);
router.put('/:id/blueprint/confirm', validateBody(confirmBlueprintSchema), LearningSessionController.confirmBlueprint);
router.post('/:id/validation/start', LearningSessionController.startValidation);
router.post('/:id/validation/response', validateBody(submitValidationResponseSchema), LearningSessionController.submitValidationResponse);
router.post('/:id/reflection', validateBody(generateReflectionSchema), LearningSessionController.generateReflection);
router.post('/:id/report', LearningSessionController.generateReport);
router.put('/:id/resume', validateBody(resumeSessionSchema), LearningSessionController.resumeSession);
router.post('/:id/complete', LearningSessionController.completeSession);
router.delete('/:id', LearningSessionController.deleteSession);

export default router;
