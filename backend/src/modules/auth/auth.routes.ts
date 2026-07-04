import { Router } from 'express';
import AuthController from './auth.controller';
import { authenticate } from '../../common/middleware/auth';
import { validateBody } from '../../common/middleware/validate';
import { registerSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation';

const router = Router();

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.post('/refresh', validateBody(refreshTokenSchema), AuthController.refreshToken);
router.post('/forgot-password', validateBody(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), AuthController.resetPassword);
router.get('/me', authenticate, AuthController.getMe);

export default router;
