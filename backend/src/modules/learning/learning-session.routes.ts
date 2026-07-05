import { Router } from 'express';
import multer from 'multer';
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

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createSessionSchema), LearningSessionController.createSession);
router.get('/', validateQuery(getSessionsQuerySchema), LearningSessionController.getStudentSessions);
router.get('/active', LearningSessionController.getActiveSession);
router.get('/:id', LearningSessionController.getSession);

router.post('/:id/upload', upload.array('files', 10), LearningSessionController.uploadFiles);
router.post('/:id/analyze', LearningSessionController.startAnalysis);
router.post('/:id/upload-and-analyze', upload.array('files', 10), LearningSessionController.uploadAndAnalyze);

router.get('/:id/blueprint', LearningSessionController.getBlueprint);
router.put('/:id/blueprint/confirm', validateBody(confirmBlueprintSchema), LearningSessionController.confirmBlueprint);

router.post('/:id/validation/start', LearningSessionController.startValidation);
router.post('/:id/validation/response', validateBody(submitValidationResponseSchema), LearningSessionController.submitValidationResponse);
router.post('/:id/validation/evaluate', LearningSessionController.evaluateAnswer);

router.post('/:id/reflection', validateBody(generateReflectionSchema), LearningSessionController.generateReflection);
router.post('/:id/reflection/analyze', LearningSessionController.analyzeFreeTextReflection);

router.post('/:id/report', LearningSessionController.generateReport);
router.put('/:id/resume', validateBody(resumeSessionSchema), LearningSessionController.resumeSession);
router.post('/:id/complete', LearningSessionController.completeSession);
router.delete('/:id', LearningSessionController.deleteSession);

export default router;
